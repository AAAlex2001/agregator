/** Пара координат Яндекс.Карт: сначала широта, затем долгота. */
export type MapCoordinates = [number, number];

/** Событие внешнего SDK; содержимое проверяется перед использованием. */
export interface YandexMapEvent {
  get(key: string): unknown;
}

/** Метка, координаты которой можно изменять перетаскиванием. */
interface YandexPlacemark {
  geometry: {
    getCoordinates(): MapCoordinates;
  };
  events: {
    add(event: string, handler: (event: YandexMapEvent) => void): void;
  };
}

/** Группа меток, которую SDK объединяет при уменьшении масштаба. */
interface YandexClusterer {
  add(placemarks: YandexPlacemark[]): void;
}

/** Используемые операции карты, без привязки к данным приложения. */
export interface YandexMap {
  geoObjects: {
    add(object: YandexPlacemark | YandexClusterer): void;
    removeAll(): void;
  };
  events: {
    add(event: string, handler: (event: YandexMapEvent) => void): void;
  };
  setCenter(center: MapCoordinates, zoom?: number): void;
  destroy(): void;
}

/** Начальная область карты и видимые элементы управления. */
interface YandexMapState {
  center: MapCoordinates;
  zoom: number;
  controls: string[];
}

/** Подсказка и содержимое всплывающей карточки метки. */
interface YandexPlacemarkProperties {
  hintContent?: string;
  balloonContentHeader?: string;
  balloonContentBody?: string;
}

/** Вид метки и возможность изменять её положение. */
interface YandexPlacemarkOptions {
  preset?: string;
  draggable?: boolean;
}

/** Настройки используемых элементов SDK Яндекс.Карт. */
export interface YandexMapsApi {
  ready(callback: () => void): void;
  Map: new (
    element: HTMLElement,
    state: YandexMapState,
    options?: { suppressMapOpenBlock?: boolean },
  ) => YandexMap;
  Placemark: new (
    coordinates: MapCoordinates,
    properties?: YandexPlacemarkProperties,
    options?: YandexPlacemarkOptions,
  ) => YandexPlacemark;
  Clusterer: new (options: {
    preset: string;
    groupByCoordinates: boolean;
  }) => YandexClusterer;
}

/** Состояние загрузки SDK; без ключа запрос внешнего скрипта не выполняется. */
export interface YandexMapsState {
  api: YandexMapsApi | null;
  status: "no-key" | "loading" | "ready" | "error";
}
