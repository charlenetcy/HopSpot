import { formatDistance, formatDuration } from "../../lib/coords";
import type { GrabPlace, RouteLeg } from "../../types/grabmaps";
import type { Stop } from "../../types/itinerary";

interface MapCanvasProps {
  title: string;
  region: string;
  stops: Stop[];
  legs: RouteLeg[];
  previewPlaces?: GrabPlace[];
}

interface Point {
  lat: number;
  lng: number;
}

const DEFAULT_CENTER = { lat: 1.3521, lng: 103.8198 };
const REGION_CENTERS: Record<string, Point> = {
  orchard: { lat: 1.3048, lng: 103.8318 },
  duxton: { lat: 1.2795, lng: 103.8438 },
  "marina bay": { lat: 1.2834, lng: 103.8607 },
  "tiong bahru": { lat: 1.2852, lng: 103.8263 },
  sentosa: { lat: 1.2494, lng: 103.8303 },
};

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
    return REGION_CENTERS[region.toLowerCase()] || DEFAULT_CENTER;
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
  previewPlaces = [],
}: MapCanvasProps) {
  const totalDuration = legs.reduce((sum, leg) => sum + leg.durationSeconds, 0);
  const totalDistance = legs.reduce((sum, leg) => sum + leg.distanceMeters, 0);
  const points = [...previewPlaces, ...stops];
  const center = getCenter(points, region);
  const zoom = getZoom(points);
  const viewportWidth = 900;
  const viewportHeight = 700;
  const tileSize = 256;
  const worldLimit = 2 ** zoom;
  const worldCenter = project(center, zoom);
  const topLeft = {
    x: worldCenter.x - viewportWidth / 2,
    y: worldCenter.y - viewportHeight / 2,
  };

  const centerTileX = Math.floor(worldCenter.x / tileSize);
  const centerTileY = Math.floor(worldCenter.y / tileSize);
  const tiles = [];

  for (let dy = -2; dy <= 2; dy += 1) {
    for (let dx = -2; dx <= 2; dx += 1) {
      const tileX = centerTileX + dx;
      const tileY = clamp(centerTileY + dy, 0, worldLimit - 1);
      tiles.push({
        key: `${zoom}-${tileX}-${tileY}`,
        src: `https://tile.openstreetmap.org/${zoom}/${mod(tileX, worldLimit)}/${tileY}.png`,
        left: tileX * tileSize - topLeft.x,
        top: tileY * tileSize - topLeft.y,
      });
    }
  }

  const stopMarkers = stops.map((stop, index) => {
    const projected = project(stop, zoom);
    return {
      ...stop,
      index,
      left: projected.x - topLeft.x,
      top: projected.y - topLeft.y,
    };
  });

  const previewMarkers = previewPlaces.slice(0, 10).map((place) => {
    const projected = project(place, zoom);
    return {
      ...place,
      left: projected.x - topLeft.x,
      top: projected.y - topLeft.y,
    };
  });

  const routePath = stopMarkers
    .map((marker, index) => `${index === 0 ? "M" : "L"} ${marker.left} ${marker.top}`)
    .join(" ");

  return (
    <section className="map-panel">
      <div className="map-surface">
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
          viewBox={`0 0 ${viewportWidth} ${viewportHeight}`}
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
            className="map-marker"
            key={stop.stopId}
            style={{ left: stop.left, top: stop.top }}
            title={stop.name}
          >
            {stop.index + 1}
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
        <div className="pill">
          {previewPlaces.length > 0 ? `${previewPlaces.length} in view` : "Live map"}
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
