import { create } from "zustand";
import { calculateRoute } from "../lib/grabmaps-client";
import { discoverItineraries } from "../lib/mock-data";
import type { RouteLeg } from "../types/grabmaps";
import type { ItineraryMeta, SavedItinerary, Stop, TransportMode } from "../types/itinerary";

interface ItineraryState {
  stops: Stop[];
  legs: RouteLeg[];
  routeGeometry?: string;
  transportMode: TransportMode;
  isCalculatingRoute: boolean;
  savedMeta: ItineraryMeta;
  savedItineraries: SavedItinerary[];
  addStop: (stop: Stop) => void;
  updateStop: (stopId: string, patch: Partial<Stop>) => void;
  removeStop: (stopId: string) => void;
  moveStop: (fromIndex: number, toIndex: number) => void;
  setTransportMode: (mode: TransportMode) => void;
  recalculateRoute: () => Promise<void>;
  saveItinerary: (meta: ItineraryMeta) => SavedItinerary;
  getItineraryById: (id: string) => SavedItinerary | undefined;
}

function isSamePlace(left: Stop, right: Stop) {
  return (
    left.id === right.id ||
    (left.name.trim().toLowerCase() === right.name.trim().toLowerCase() &&
      left.address.trim().toLowerCase() === right.address.trim().toLowerCase())
  );
}

function reorder<T>(items: T[], fromIndex: number, toIndex: number) {
  const copy = [...items];
  const [moved] = copy.splice(fromIndex, 1);
  copy.splice(toIndex, 0, moved);
  return copy;
}

export const defaultMeta: ItineraryMeta = {
  title: "My itinerary",
  description: "",
  areaLabel: "Orchard",
  coverEmoji: "🗺️",
  isPublic: true,
};

export const useItineraryStore = create<ItineraryState>((set, get) => ({
  stops: [],
  legs: [],
  routeGeometry: undefined,
  transportMode: "walking",
  isCalculatingRoute: false,
  savedMeta: defaultMeta,
  savedItineraries: [],
  addStop: (stop) =>
    set((state) => ({
      stops: state.stops.some((existing) => isSamePlace(existing, stop))
        ? state.stops
        : [...state.stops, stop],
    })),
  updateStop: (stopId, patch) =>
    set((state) => ({
      stops: state.stops.map((stop) =>
        stop.stopId === stopId ? { ...stop, ...patch } : stop,
      ),
    })),
  removeStop: (stopId) =>
    set((state) => ({
      stops: state.stops.filter((stop) => stop.stopId !== stopId),
    })),
  moveStop: (fromIndex, toIndex) =>
    set((state) => ({
      stops: reorder(state.stops, fromIndex, toIndex),
    })),
  setTransportMode: (mode) => set({ transportMode: mode }),
  recalculateRoute: async () => {
    const { stops, transportMode } = get();
    set({ isCalculatingRoute: true });
    const route = await calculateRoute(stops, transportMode);
    set({
      legs: route.legs,
      routeGeometry: route.geometry,
      isCalculatingRoute: false,
    });
  },
  saveItinerary: (meta) => {
    set({ savedMeta: meta });
    const state = get();
    const itinerary = {
      id: `draft-${Date.now()}`,
      creator: "You",
      username: "you",
      createdAt: new Date().toISOString(),
      transportMode: state.transportMode,
      stops: state.stops,
      legs: state.legs,
      routeGeometry: state.routeGeometry,
      ...meta,
    };
    set((current) => ({
      savedItineraries: [itinerary, ...current.savedItineraries],
    }));
    return itinerary;
  },
  getItineraryById: (id) =>
    [...get().savedItineraries, ...discoverItineraries].find(
      (itinerary) => itinerary.id === id,
    ),
}));

export function getFeaturedDrafts() {
  return discoverItineraries;
}
