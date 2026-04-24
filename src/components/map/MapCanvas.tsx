import polyline from "@mapbox/polyline";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, WheelEvent as ReactWheelEvent } from "react";
import { Crosshair, ZoomIn, ZoomOut } from "lucide-react";
import { getAreaCenter } from "../../lib/areas";
import { formatDistance, formatDuration } from "../../lib/coords";
import type { GrabPlace, RouteLeg } from "../../types/grabmaps";
import type { Stop } from "../../types/itinerary";

interface MapCanvasProps {
  title: string;
  region: string;
  stops: Stop[];
  legs: RouteLeg[];
  routeGeometry?: string;
  previewPlaces?: GrabPlace[];
}

interface Point {
  lat: number;
  lng: number;
}

const DEFAULT_CENTER = { lat: 1.3521, lng: 103.8198 };
function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function mod(value: number, base: number) {
  return ((value % base) + base) % base;
}

function project(point: Point, zoom: number) {
  const scale = 256 * 2 ** zoom;
  const sinLat = Math.sin((point.lat * Math.PI) / 180);
  const safeSin = clamp(sinLat, -0.9999, 0.9999);

  return {
    x: ((point.lng + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + safeSin) / (1 - safeSin)) / (4 * Math.PI)) * scale,
  };
}

function unproject(x: number, y: number, zoom: number) {
  const scale = 256 * 2 ** zoom;
  const lng = (x / scale) * 360 - 180;
  const mercator = Math.PI - (2 * Math.PI * y) / scale;
  const lat = (Math.atan(Math.sinh(mercator)) * 180) / Math.PI;

  return { lat, lng };
}

function getZoom(points: Point[]) {
  if (points.length < 2) {
    return 14;
  }

  const lats = points.map((point) => point.lat);
  const lngs = points.map((point) => point.lng);
  const span = Math.max(
    Math.max(...lats) - Math.min(...lats),
    Math.max(...lngs) - Math.min(...lngs),
  );

  if (span > 0.25) return 11;
  if (span > 0.12) return 12;
  if (span > 0.05) return 13;
  if (span > 0.02) return 14;
  if (span > 0.008) return 15;
  return 16;
}

function getCenter(points: Point[], region: string) {
  if (points.length === 0) {
    return getAreaCenter(region) || DEFAULT_CENTER;
  }

  return {
    lat: points.reduce((sum, point) => sum + point.lat, 0) / points.length,
    lng: points.reduce((sum, point) => sum + point.lng, 0) / points.length,
  };
}

export function MapCanvas({
  title,
  region,
  stops,
  legs,
  routeGeometry,
  previewPlaces = [],
}: MapCanvasProps) {
  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const totalDuration = legs.reduce((sum, leg) => sum + leg.durationSeconds, 0);
  const totalDistance = legs.reduce((sum, leg) => sum + leg.distanceMeters, 0);
  const points = useMemo(() => [...previewPlaces, ...stops], [previewPlaces, stops]);
  const autoCenter = useMemo(() => getCenter(points, region), [points, region]);
  const autoZoom = useMemo(() => getZoom(points), [points]);
  const [viewport, setViewport] = useState({ width: 900, height: 620 });
  const [viewCenter, setViewCenter] = useState(autoCenter);
  const [viewZoom, setViewZoom] = useState(autoZoom);
  const [dragState, setDragState] = useState<{
    pointerId: number;
    startX: number;
    startY: number;
    centerX: number;
    centerY: number;
  } | null>(null);
  const tileSize = 256;
  const worldLimit = 2 ** viewZoom;
  const worldCenter = project(viewCenter, viewZoom);
  const topLeft = {
    x: worldCenter.x - viewport.width / 2,
    y: worldCenter.y - viewport.height / 2,
  };

  useEffect(() => {
    setViewCenter(autoCenter);
    setViewZoom(autoZoom);
  }, [autoCenter, autoZoom]);

  useEffect(() => {
    const element = surfaceRef.current;
    if (!element) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }

      setViewport({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const centerTileX = Math.floor(worldCenter.x / tileSize);
  const centerTileY = Math.floor(worldCenter.y / tileSize);
  const tiles = [];

  for (let dy = -2; dy <= 2; dy += 1) {
    for (let dx = -2; dx <= 2; dx += 1) {
      const tileX = centerTileX + dx;
      const tileY = clamp(centerTileY + dy, 0, worldLimit - 1);
      tiles.push({
        key: `${viewZoom}-${tileX}-${tileY}`,
        src: `https://tile.openstreetmap.org/${viewZoom}/${mod(tileX, worldLimit)}/${tileY}.png`,
        left: tileX * tileSize - topLeft.x,
        top: tileY * tileSize - topLeft.y,
      });
    }
  }

  const stopMarkers = stops.map((stop, index) => {
    const projected = project(stop, viewZoom);
    return {
      ...stop,
      index,
      left: projected.x - topLeft.x,
      top: projected.y - topLeft.y,
    };
  });

  const previewMarkers = previewPlaces.slice(0, 10).map((place) => {
    const projected = project(place, viewZoom);
    return {
      ...place,
      left: projected.x - topLeft.x,
      top: projected.y - topLeft.y,
    };
  });

  const decodedRoutePoints =
    routeGeometry && stops.length > 1
      ? polyline.decode(routeGeometry, 6).map(([lat, lng]) => ({ lat, lng }))
      : [];

  const routePathPoints = decodedRoutePoints.length > 1
    ? decodedRoutePoints.map((point) => {
        const projected = project(point, viewZoom);
        return {
          left: projected.x - topLeft.x,
          top: projected.y - topLeft.y,
        };
      })
    : stopMarkers.map((marker) => ({
        left: marker.left,
        top: marker.top,
      }));

  const routePath = routePathPoints
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.left} ${point.top}`)
    .join(" ");

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const centerPoint = project(viewCenter, viewZoom);
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragState({
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      centerX: centerPoint.x,
      centerY: centerPoint.y,
    });
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    const nextCenter = unproject(
      dragState.centerX - (event.clientX - dragState.startX),
      dragState.centerY - (event.clientY - dragState.startY),
      viewZoom,
    );

    setViewCenter(nextCenter);
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragState?.pointerId === event.pointerId) {
      setDragState(null);
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const adjustZoom = (delta: number) => {
    setViewZoom((current) => clamp(current + delta, 11, 17));
  };

  const handleWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    adjustZoom(event.deltaY > 0 ? -1 : 1);
  };

  return (
    <section className="map-panel">
      <div
        ref={surfaceRef}
        className={`map-surface ${dragState ? "is-dragging" : ""}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
      >
        <div className="map-tiles" aria-hidden="true">
          {tiles.map((tile) => (
            <img
              key={tile.key}
              className="map-tile"
              src={tile.src}
              alt=""
              style={{ left: tile.left, top: tile.top }}
            />
          ))}
        </div>

        <svg
          className="map-lines"
          viewBox={`0 0 ${viewport.width} ${viewport.height}`}
          preserveAspectRatio="none"
        >
          {routePath ? <path d={routePath} className="map-route-line" /> : null}
        </svg>

        {previewMarkers.map((place) => (
          <div
            key={`preview-${place.id}`}
            className="map-preview-marker"
            style={{ left: place.left, top: place.top }}
            title={place.name}
          />
        ))}

        {stopMarkers.map((stop) => (
          <div
            className="map-marker-stack"
            key={stop.stopId}
            style={{ left: stop.left, top: stop.top }}
            title={stop.name}
          >
            <div className="map-marker">{stop.index + 1}</div>
            <div className="map-marker-label">{stop.name}</div>
          </div>
        ))}

        {points.length === 0 ? (
          <div className="map-empty">
            <strong>{region || "Singapore"}</strong>
            <span>Search to preview spots</span>
          </div>
        ) : null}
      </div>

      <div className="map-caption">
        <div>
          <strong>{title}</strong>
          <div className="muted">{region || "Singapore"}</div>
        </div>
        <div className="toolbar">
          <div className="pill">
            {previewPlaces.length > 0 ? `${previewPlaces.length} in view` : "Live map"}
          </div>
          <button type="button" className="ghost-button map-control" onClick={() => adjustZoom(1)}>
            <ZoomIn size={16} />
          </button>
          <button type="button" className="ghost-button map-control" onClick={() => adjustZoom(-1)}>
            <ZoomOut size={16} />
          </button>
          <button
            type="button"
            className="ghost-button map-control"
            onClick={() => {
              setViewCenter(autoCenter);
              setViewZoom(autoZoom);
            }}
          >
            <Crosshair size={16} />
          </button>
        </div>
      </div>

      <div className="summary-bar">
        <span>{stops.length} stops</span>
        <span>{formatDistance(totalDistance)}</span>
        <span>{formatDuration(totalDuration || 0)}</span>
      </div>
    </section>
  );
}
