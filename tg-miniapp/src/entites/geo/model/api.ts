import { apiJson } from "@/shared/services/api";

export interface GeoPoint {
  lat: number;
  lng: number;
  address: string;
  city: string | null;
}

export async function geoSuggest(query: string): Promise<GeoPoint[]> {
  const data = await apiJson<{ items: GeoPoint[] }>(`/geo/suggest?q=${encodeURIComponent(query)}`);
  return data.items;
}
