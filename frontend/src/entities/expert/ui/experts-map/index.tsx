"use client";

import { MarkersMap } from "@/shared/ui/markers-map";
import type { MapMarker } from "@/shared/ui/markers-map";
import { getExpertMapBalloon } from "../../model/map-balloon";
import type { ExpertMapItem } from "../../model/types";

/** Исполнители для отображения и адрес страницы покупки контактов. */
interface ExpertsMapProps {
  items: ExpertMapItem[];
  height?: number | string;
  emptyText?: string;
  contactsHref?: string;
}

/** Отображает готовый список исполнителей с их публичными карточками на карте. */
export function ExpertsMap({
  items,
  height = 420,
  emptyText,
  contactsHref = "/expert-contacts",
}: ExpertsMapProps) {
  /** Готовит координаты и содержимое карточки одного исполнителя. */
  function createMarker(expert: ExpertMapItem): MapMarker {
    return {
      coordinates: [expert.lat, expert.lng],
      title: expert.full_name,
      body: getExpertMapBalloon(expert, contactsHref),
    };
  }

  return (
    <MarkersMap
      markers={items.map(createMarker)}
      height={height}
      emptyText={emptyText}
    />
  );
}
