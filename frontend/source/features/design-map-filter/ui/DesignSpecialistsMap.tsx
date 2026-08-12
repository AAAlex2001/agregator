"use client";

import { useExpertsMap } from "@/source/entities/expert";
import { useSession } from "@/source/features/session";
import { toMarker } from "@/source/features/expert-map-filter";
import { YandexMarkersMap } from "@/source/shared/ui/YandexMap";
import { useDesignMapFilter } from "../model/useDesignMapFilter";
import { FilterDropdown } from "./FilterDropdown";
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
  } = useDesignMapFilter();

  const emptyText = isLoading
    ? "Загрузка карты исполнителей…"
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
            value: specialty.title,
            short: specialty.code,
            title: specialty.title,
          }))}
          selected={specialties}
          onToggle={toggleSpecialty}
        />
      </div>

      <div className={s.mapBox}>
        <YandexMarkersMap
          markers={items.map(toMarker)}
          height="100%"
          emptyText={emptyText}
          contactsHref={user ? "/landing/expert-contacts" : "/expert-contacts"}
        />
      </div>
    </div>
  );
}
