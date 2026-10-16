import type { MapCoordinates } from "@/shared/lib/yandex-maps";

/** Точка карты: заголовок передаётся текстом, содержимое карточки — готовым HTML. */
export interface MapMarker {
  coordinates: MapCoordinates;
  title: string;
  body: string;
}

/** Метки и внешний размер карты с необязательной подписью пустого результата. */
export interface MarkersMapProps {
  markers: MapMarker[];
  height?: number | string;
  emptyText?: string;
}
