"use client";

import { useExpertsMap } from "@/source/entities/expert";
import { useSession } from "@/source/features/session";
import { toMarker } from "@/source/features/expert-map-filter";
import ToolTip from "@/source/shared/ui/Tooltip";
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
  } = useDesignMapFilter();

  const emptyText = isLoading
    ? "Загрузка карты исполнителей…"
    : "Пока нет исполнителей этого направления";

  return (
    <div className={s.layout}>
      <div className={s.categoriesAxis} role="group" aria-label="Фильтр по видам документации">
        {availableCategories.map((category) => (
          <ToolTip key={category.code} message={category.title} side="right" ariaLabel={category.title}>
            <button
              type="button"
              className={`${s.chip} ${categories.includes(category.code) ? s.chipActive : ""}`}
              onClick={() => toggleCategory(category.code)}
            >
              {category.code}
            </button>
          </ToolTip>
        ))}
      </div>

      <div className={s.mapBox}>
        <YandexMarkersMap
          markers={items.map(toMarker)}
          height="100%"
          emptyText={emptyText}
          contactsHref={user ? "/landing/expert-contacts" : "/expert-contacts"}
        />
      </div>

      <div className={s.specialtiesAxis} role="group" aria-label="Фильтр по специалистам">
        {availableSpecialties.map((specialty) => (
          <ToolTip key={specialty.title} message={specialty.title} side="bottom" ariaLabel={specialty.title}>
            <button
              type="button"
              className={`${s.chip} ${specialties.includes(specialty.title) ? s.chipActive : ""}`}
              onClick={() => toggleSpecialty(specialty.title)}
            >
              {specialty.code}
            </button>
          </ToolTip>
        ))}
      </div>
    </div>
  );
}
