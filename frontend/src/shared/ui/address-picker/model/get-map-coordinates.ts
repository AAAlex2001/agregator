import type { MapCoordinates, YandexMapEvent } from "@/shared/lib/yandex-maps";

/** Проверяет координаты из события внешнего SDK. */
export function getMapCoordinates(event: YandexMapEvent): MapCoordinates | null {
  const coordinates = event.get("coords");

  if (
    !Array.isArray(coordinates) ||
    coordinates.length < 2 ||
    typeof coordinates[0] !== "number" ||
    typeof coordinates[1] !== "number"
  ) {
    return null;
  }

  return [coordinates[0], coordinates[1]];
}
