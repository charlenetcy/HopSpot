export interface LatLng {
  lat: number;
  lng: number;
}

export function toLatFirst(coords: LatLng) {
  return `${coords.lat},${coords.lng}`;
}

export function toLngFirst(coords: LatLng) {
  return `${coords.lng},${coords.lat}`;
}

export function formatDistance(distanceMeters: number) {
  if (distanceMeters < 1000) {
    return `${distanceMeters} m`;
  }

  return `${(distanceMeters / 1000).toFixed(1)} km`;
}

export function formatDuration(durationSeconds: number) {
  const minutes = Math.round(durationSeconds / 60);
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}
