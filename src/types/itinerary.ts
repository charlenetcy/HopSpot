import type { GrabCategory, GrabPlace, RouteLeg } from "./grabmaps";

export type TransportMode = "walking" | "driving" | "cycling";

export interface Stop extends GrabPlace {
  stopId: string;
  emoji: string;
  note: string;
  arriveBy: string;
  estimatedStayMins: number;
}

export interface ItineraryMeta {
  title: string;
  description: string;
  areaLabel: string;
  coverEmoji: string;
  isPublic: boolean;
}

export interface SavedItinerary extends ItineraryMeta {
  id: string;
  creator: string;
  username: string;
  transportMode: TransportMode;
  stops: Stop[];
  legs: RouteLeg[];
  routeGeometry?: string;
  createdAt: string;
  isKOL?: boolean;
}

export interface WishlistItem extends GrabPlace {
  emoji: string;
  note: string;
  savedAt: string;
}

export const categoryEmoji: Record<GrabCategory, string> = {
  cafe: "☕",
  bar: "🍸",
  restaurant: "🍜",
  park: "🌿",
  shop: "🛍️",
  activity: "🎭",
};
