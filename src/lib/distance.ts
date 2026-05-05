/**
 * Calculate distance between two geographic coordinates using the Haversine formula
 * @param lat1 - Latitude of first point
 * @param lng1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lng2 - Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number | null,
  lng1: number | null,
  lat2: number | null,
  lng2: number | null
): number {
  if (!lat1 || !lng1 || !lat2 || !lng2) return 0;

  const R = 6371; // Radius of Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Format distance for display
 * @param distanceKm - Distance in kilometers
 * @returns Formatted string
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${(distanceKm * 1000).toFixed(0)} m`;
  }
  if (distanceKm < 10) {
    return `${distanceKm.toFixed(1)} km`;
  }
  return `${Math.round(distanceKm)} km`;
}

/**
 * Sort items by distance
 */
export function sortByDistance<T extends { distanceKm: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.distanceKm - b.distanceKm);
}

/**
 * Filter items within a certain distance
 */
export function filterByDistance<T extends { distanceKm: number }>(
  items: T[],
  maxDistanceKm: number
): T[] {
  return items.filter((item) => item.distanceKm <= maxDistanceKm);
}
