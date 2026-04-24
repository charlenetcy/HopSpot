export interface AreaOption {
  name: string;
  lat: number;
  lng: number;
}

export const AREA_OPTIONS: AreaOption[] = [
  { name: "Orchard", lat: 1.3048, lng: 103.8318 },
  { name: "Tiong Bahru", lat: 1.2852, lng: 103.8263 },
  { name: "Duxton", lat: 1.2795, lng: 103.8438 },
  { name: "Marina Bay", lat: 1.2834, lng: 103.8607 },
  { name: "Bugis", lat: 1.3009, lng: 103.8553 },
  { name: "Clarke Quay", lat: 1.2883, lng: 103.8466 },
  { name: "Chinatown", lat: 1.2838, lng: 103.8448 },
  { name: "Holland Village", lat: 1.3119, lng: 103.7969 },
  { name: "Dempsey", lat: 1.3043, lng: 103.8119 },
  { name: "Sentosa", lat: 1.2494, lng: 103.8303 },
  { name: "East Coast", lat: 1.3027, lng: 103.9074 },
  { name: "Katong", lat: 1.3053, lng: 103.9052 },
  { name: "Joo Chiat", lat: 1.3143, lng: 103.9018 },
  { name: "CBD", lat: 1.2799, lng: 103.8503 },
  { name: "River Valley", lat: 1.2931, lng: 103.8358 },
  { name: "Newton", lat: 1.3121, lng: 103.8381 },
  { name: "Novena", lat: 1.3201, lng: 103.8439 },
  { name: "Toa Payoh", lat: 1.3321, lng: 103.8474 },
  { name: "Little India", lat: 1.3067, lng: 103.8496 },
  { name: "Kampong Glam", lat: 1.3022, lng: 103.859 },
];

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export function findAreaMatch(input: string) {
  const normalized = normalize(input);
  if (!normalized) {
    return undefined;
  }

  return (
    AREA_OPTIONS.find((area) => normalize(area.name) === normalized) ||
    AREA_OPTIONS.find((area) => normalize(area.name).startsWith(normalized)) ||
    AREA_OPTIONS.find((area) => normalize(area.name).includes(normalized))
  );
}

export function suggestAreas(input: string) {
  const normalized = normalize(input);
  if (!normalized) {
    return AREA_OPTIONS.slice(0, 6);
  }

  return AREA_OPTIONS.filter((area) => normalize(area.name).includes(normalized)).slice(0, 6);
}

export function getAreaCenter(input: string) {
  return findAreaMatch(input);
}
