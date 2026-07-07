export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  city?: string | null;
  rating?: number | null;
  travelsToOtherRegions?: boolean;
  certificates?: string[] | null;
  phone?: string | null;
  email?: string | null;
}

export interface SelectedLocation {
  lat: number;
  lng: number;
  address: string;
  city: string | null;
}

export interface YmapsEvent {
  get(key: string): unknown;
}

export interface YmapsPlacemark {
  geometry: { getCoordinates(): [number, number] };
  events: { add(event: string, handler: (e: YmapsEvent) => void): void };
}

export interface YmapsClusterer {
  add(objects: YmapsPlacemark[]): void;
}

export interface YmapsMap {
  geoObjects: { add(object: unknown): void; removeAll(): void };
  events: { add(event: string, handler: (e: YmapsEvent) => void): void };
  setCenter(center: [number, number], zoom?: number): void;
  destroy(): void;
}

export interface Ymaps {
  ready(callback: () => void): void;
  Map: new (
    element: HTMLElement | string,
    state: Record<string, unknown>,
    options?: Record<string, unknown>,
  ) => YmapsMap;
  Placemark: new (
    coordinates: [number, number],
    properties?: Record<string, unknown>,
    options?: Record<string, unknown>,
  ) => YmapsPlacemark;
  Clusterer: new (options?: Record<string, unknown>) => YmapsClusterer;
}

declare global {
  interface Window {
    ymaps?: Ymaps;
  }
}
