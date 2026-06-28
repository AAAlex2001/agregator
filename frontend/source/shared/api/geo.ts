import { API_URL } from "./config";

export interface GeoPoint {
  lat: number;
  lng: number;
  address: string;
  city: string | null;
}

export async function fetchGeoSuggest(query: string): Promise<GeoPoint[]> {
  const response = await fetch(`${API_URL}/geo/suggest?q=${encodeURIComponent(query)}`, {
    credentials: "include",
  });
  if (!response.ok) return [];
  const body = (await response.json()) as { items: GeoPoint[] };
  return body.items;
}

export async function fetchGeoReverse(lat: number, lng: number): Promise<GeoPoint | null> {
  const response = await fetch(`${API_URL}/geo/reverse?lat=${lat}&lng=${lng}`, {
    credentials: "include",
  });
  if (!response.ok) return null;
  return (await response.json()) as GeoPoint;
}
