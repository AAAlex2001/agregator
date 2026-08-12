"use client";

import { useExpertsMap } from "@/source/entities/expert";
import { useSession } from "@/source/features/session";
import { FilterableExpertsMap } from "./FilterableExpertsMap";

export function ExpertiseExpertsMap() {
  const { user } = useSession();
  const { items, isLoading } = useExpertsMap();

  const emptyText = isLoading
    ? "Загрузка карты исполнителей…"
    : "Пока нет исполнителей этого направления";

  return (
    <FilterableExpertsMap
      items={items}
      height="100%"
      emptyText={emptyText}
      contactsHref={user ? "/landing/expert-contacts" : "/expert-contacts"}
    />
  );
}
