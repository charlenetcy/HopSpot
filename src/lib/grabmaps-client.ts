import { estimateRoute, searchMockPlaces } from "./mock-data";
import type { GrabCategory, GrabPlace, RouteData } from "../types/grabmaps";
import type { Stop, TransportMode } from "../types/itinerary";

const proxyBase = import.meta.env.VITE_GRABMAPS_PROXY_URL?.trim() || "";

async function proxyGet<T>(path: string, params: URLSearchParams) {
  if (!proxyBase) {
    throw new Error("GrabMaps proxy is not configured.");
  }

  const url = `${proxyBase}?path=${encodeURIComponent(path)}&query=${encodeURIComponent(params.toString())}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY ?? ""}`,
    },
  });

  if (!response.ok) {
    throw new Error(`GrabMaps proxy failed with ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error("GrabMaps proxy returned a non-JSON response.");
  }

  return (await response.json()) as T;
}

export async function searchPlaces(
  keyword: string,
  category?: GrabCategory,
  region?: string,
) {
  if (!proxyBase) {
    return searchMockPlaces(
      [keyword, category].filter(Boolean).join(" "),
      region,
    );
  }

  const params = new URLSearchParams();
  params.set(
    "keyword",
    [keyword, category].filter(Boolean).join(" ").trim(),
  );
  params.set("country", "SGP");
  params.set("location", "1.3521,103.8198");
  params.set("limit", "8");

  try {
    const data = await proxyGet<{
      places?: Array<{
        poi_id?: string;
        name?: string;
        formatted_address?: string;
        business_type?: string;
        location?: { latitude?: number; longitude?: number };
      }>;
    }>("/api/v1/maps/poi/v1/search", params);

    return (data.places ?? []).map<GrabPlace>((place, index) => ({
      id: place.poi_id || `place-${index}`,
      name: place.name || "Unknown spot",
      address: place.formatted_address || "No address available",
      businessType: place.business_type || category || "spot",
      category: (category || "activity") as GrabCategory,
      lat: place.location?.latitude || 1.3521,
      lng: place.location?.longitude || 103.8198,
      region: region || "Singapore",
    }));
  } catch (error) {
    console.warn("Falling back to mock place search:", error);
    return searchMockPlaces(
      [keyword, category].filter(Boolean).join(" "),
      region,
    );
  }
}

export async function calculateRoute(
  stops: Stop[],
  mode: TransportMode,
): Promise<RouteData> {
  if (stops.length <= 1 || !proxyBase) {
    return estimateRoute(stops, mode);
  }

  const params = new URLSearchParams();
  stops.forEach((stop) => params.append("coordinates", `${stop.lng},${stop.lat}`));
  params.set("profile", mode);
  params.set("overview", "full");
  params.set("geometries", "polyline6");

  try {
    const data = await proxyGet<{
      routes?: Array<{
        geometry?: string;
        legs?: Array<{ duration?: number; distance?: number }>;
      }>;
    }>("/api/v1/maps/eta/v1/direction", params);

    const route = data.routes?.[0];

    return {
      geometry: route?.geometry,
      legs: (route?.legs ?? []).map((leg) => ({
        durationSeconds: Math.round(leg.duration ?? 0),
        distanceMeters: Math.round(leg.distance ?? 0),
      })),
    };
  } catch (error) {
    console.warn("Falling back to mock route estimation:", error);
    return estimateRoute(stops, mode);
  }
}
