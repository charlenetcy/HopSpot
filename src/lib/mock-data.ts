import type { GrabPlace, RouteLeg } from "../types/grabmaps";
import type { SavedItinerary, Stop, WishlistItem } from "../types/itinerary";
import { categoryEmoji } from "../types/itinerary";

const basePlaces: GrabPlace[] = [
  {
    id: "orchard-antoinette",
    name: "Antoinette Cafe",
    address: "Penang Road, Orchard, Singapore",
    businessType: "cafe",
    category: "cafe",
    lat: 1.3038,
    lng: 103.8353,
    region: "Orchard",
  },
  {
    id: "orchard-no-sleep-club",
    name: "No Sleep Club",
    address: "Ann Siang Hill, Singapore",
    businessType: "bar",
    category: "bar",
    lat: 1.2826,
    lng: 103.8467,
    region: "Duxton",
  },
  {
    id: "orchard-emerald-park",
    name: "Emerald Pocket Park",
    address: "Emerald Hill, Orchard, Singapore",
    businessType: "park",
    category: "park",
    lat: 1.3046,
    lng: 103.8393,
    region: "Orchard",
  },
  {
    id: "orchard-ceu-la-vi",
    name: "CÉ LA VI Sky Lounge",
    address: "Marina Bay Sands, Singapore",
    businessType: "bar",
    category: "bar",
    lat: 1.2834,
    lng: 103.8607,
    region: "Marina Bay",
  },
  {
    id: "orchard-design-orchard",
    name: "Design Orchard",
    address: "Orchard Road, Singapore",
    businessType: "shopping",
    category: "shop",
    lat: 1.3025,
    lng: 103.838,
    region: "Orchard",
  },
  {
    id: "orchard-firebird",
    name: "Firebird by Suetomi",
    address: "Paragon, Orchard, Singapore",
    businessType: "restaurant",
    category: "restaurant",
    lat: 1.3044,
    lng: 103.8359,
    region: "Orchard",
  },
];

function createStop(place: GrabPlace, index: number): Stop {
  return {
    ...place,
    stopId: `${place.id}-${index}`,
    emoji: categoryEmoji[place.category],
    note: [
      "Try the signature order and stay near the window.",
      "Best for golden hour and people watching.",
      "A nice pacing reset before the next stop.",
    ][index % 3],
    arriveBy: ["17:30", "19:00", "20:30"][index % 3],
    estimatedStayMins: [60, 90, 75][index % 3],
  };
}

export function searchMockPlaces(query: string, region?: string) {
  const q = query.toLowerCase().trim();
  return basePlaces.filter((place) => {
    const matchesQuery =
      q.length === 0 ||
      place.name.toLowerCase().includes(q) ||
      place.region.toLowerCase().includes(q) ||
      place.businessType.toLowerCase().includes(q);
    const matchesRegion =
      !region || place.region.toLowerCase().includes(region.toLowerCase());
    return matchesQuery && matchesRegion;
  });
}

export function estimateRoute(stops: Stop[], mode: string): RouteLeg[] {
  const baseByMode = {
    walking: 11,
    driving: 6,
    cycling: 8,
  } as const;
  const multiplier = baseByMode[mode as keyof typeof baseByMode] ?? 10;

  return stops.slice(1).map((_, index) => ({
    durationSeconds: (multiplier + index * 4) * 60,
    distanceMeters: 900 + index * 550,
  }));
}

export const discoverItineraries: SavedItinerary[] = [
  {
    id: "sunset-orchard-loop",
    title: "Sunset Orchard Loop",
    description: "Coffee, shopping, then skyline drinks without backtracking.",
    areaLabel: "Orchard",
    coverEmoji: "🌇",
    isPublic: true,
    creator: "Mei Tan",
    username: "mei",
    transportMode: "walking",
    stops: [
      createStop(basePlaces[0], 0),
      createStop(basePlaces[4], 1),
      createStop(basePlaces[5], 2),
    ],
    legs: [
      { durationSeconds: 660, distanceMeters: 850 },
      { durationSeconds: 780, distanceMeters: 1200 },
    ],
    createdAt: "2026-04-23T16:00:00.000Z",
    isKOL: true,
  },
  {
    id: "duxton-after-dark",
    title: "Duxton After Dark",
    description: "A tighter bar-hop flow that feels curated, not chaotic.",
    areaLabel: "Duxton",
    coverEmoji: "🌙",
    isPublic: true,
    creator: "Alex Chua",
    username: "alex",
    transportMode: "walking",
    stops: [
      createStop(basePlaces[1], 0),
      createStop(basePlaces[3], 1),
    ],
    legs: [{ durationSeconds: 960, distanceMeters: 1600 }],
    createdAt: "2026-04-22T10:30:00.000Z",
  },
];

export const wishlistSeed: WishlistItem[] = [
  {
    ...basePlaces[2],
    emoji: "🌿",
    note: "Possible calm reset between brunch and dinner.",
    savedAt: "2026-04-24T08:00:00.000Z",
  },
  {
    ...basePlaces[3],
    emoji: "🍸",
    note: "Save for a more dressy night plan.",
    savedAt: "2026-04-21T11:30:00.000Z",
  },
];
