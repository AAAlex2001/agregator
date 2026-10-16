/** Адрес с координатами: такой объект возвращает серверный геокодер. */
export interface SelectedLocation {
  lat: number;
  lng: number;
  address: string;
  city: string | null;
}

