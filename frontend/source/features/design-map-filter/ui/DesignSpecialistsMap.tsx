"use client";

import { useExpertsMap } from "@/source/entities/expert";
import { useSession } from "@/source/features/session";
import { FilterDropdown, toMarker } from "@/source/features/expert-map-filter";
import { YandexMarkersMap } from "@/source/shared/ui/YandexMap";
import { useDesignMapFilter } from "../model/useDesignMapFilter";
import s from "./designSpecialistsMap.module.scss";

export function DesignSpecialistsMap() {
  const { user } = useSession();
  const { items, isLoading } = useExpertsMap("DESIGN");
  const {
    categories,
    specialties,
    availableCategories,
    availableSpecialties,
    toggleCategory,
    toggleSpecialty,
    filtered,
  } = useDesignMapFilter(items);

  const emptyText = isLoading
    ? "Загрузка карты исполнителей…"
    : items.length > 0
      ? "По выбранным фильтрам исполнителей не нашлось — снимите часть фильтров"
      : "Пока нет исполнителей этого направления";

  return (
    <div className={s.layout}>
      <div className={s.filters}>
        <FilterDropdown
          label="Виды документации"
          options={availableCategories.map((category) => ({
            value: category.code,
            short: category.code,
            title: category.title,
          }))}
          selected={categories}
          onToggle={(value) => toggleCategory(value as (typeof categories)[number])}
        />
        <FilterDropdown
          label="Специалисты"
          options={availableSpecialties.map((specialty) => ({
            value: specialty.key,
            short: specialty.code,
            title: specialty.title,
          }))}
          selected={specialties}
          onToggle={toggleSpecialty}
        />
      </div>

      <div className={s.mapBox}>
        <YandexMarkersMap
          markers={filtered.map(toMarker)}
          height="100%"
          emptyText={emptyText}
          contactsHref={user ? "/landing/expert-contacts" : "/expert-contacts"}
        />
      </div>
    </div>
  );
}
