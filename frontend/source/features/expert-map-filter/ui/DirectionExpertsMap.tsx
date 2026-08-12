"use client";

import { useExpertsMap } from "@/source/entities/expert";
import { useSession } from "@/source/features/session";
import { YandexMarkersMap } from "@/source/shared/ui/YandexMap";
import { toMarker } from "../model/toMarker";

export function DirectionExpertsMap({ direction }: { direction: string | null }) {
  const { user } = useSession();
  const { items, isLoading } = useExpertsMap(direction);

  const emptyText =
    direction === null
      ? "Исполнители этого направления скоро появятся на площадке"
      : isLoading
        ? "Загрузка карты исполнителей…"
        : "Пока нет исполнителей этого направления";

  return (
    <YandexMarkersMap
      markers={items.map(toMarker)}
      height="100%"
      emptyText={emptyText}
      contactsHref={user ? "/landing/expert-contacts" : "/expert-contacts"}
    />
  );
}
