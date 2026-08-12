"use client";

import ToolTip from "@/source/shared/ui/Tooltip";
import { YandexMarkersMap } from "@/source/shared/ui/YandexMap";
import { useDesignMapFilter } from "../model/useDesignMapFilter";
import s from "./designSpecialistsMap.module.scss";

const EMPTY_TEXT = "Проектировщики скоро появятся на площадке";

export function DesignSpecialistsMap() {
  const {
    categories,
    specialties,
    availableCategories,
    availableSpecialties,
    toggleCategory,
    toggleSpecialty,
  } = useDesignMapFilter();

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
        <YandexMarkersMap markers={[]} height="100%" emptyText={EMPTY_TEXT} />
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
