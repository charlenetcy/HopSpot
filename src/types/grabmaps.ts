export type GrabCategory =
  | "cafe"
  | "bar"
  | "restaurant"
  | "park"
  | "shop"
  | "activity";

export interface GrabPlace {
  id: string;
  name: string;
  address: string;
  businessType: string;
  category: GrabCategory;
  lat: number;
  lng: number;
  region: string;
}

export interface RouteLeg {
  durationSeconds: number;
  distanceMeters: number;
}
