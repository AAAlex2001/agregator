"use client";

import type { RtnTaxonomy } from "@/source/entities/rtn";
import { useCatalogFilters } from "../model/useCatalogFilters";
import { OptionsSection } from "./OptionsSection";
import { PeriodSection } from "./PeriodSection";
import s from "./CatalogFilters.module.scss";

interface CatalogFiltersProps {
  taxonomy: RtnTaxonomy;
}

/** Панель фильтров каталога. «Сбросить всё» снимает фильтры, но оставляет строку поиска. */
export function CatalogFilters({ taxonomy }: CatalogFiltersProps) {
  const { hasFilters, reset } = useCatalogFilters();

  return (
    <aside className={s.filters} aria-label="Фильтры каталога">
      <div className={s.head}>
        <h2 className={s.title}>Фильтры</h2>
        {hasFilters && (
          <button type="button" className={s.reset} onClick={reset}>
            Сбросить всё
          </button>
        )}
      </div>

      <OptionsSection title="Тип документа" param="document_type" options={taxonomy.document_types} />
      <OptionsSection title="Актуальность" param="status" options={taxonomy.statuses} />
      <PeriodSection />
      <OptionsSection title="Область надзора" param="oversight_area" options={taxonomy.oversight_areas} />
      <OptionsSection title="Отрасль" param="industry" options={taxonomy.industries} />
      <OptionsSection title="Вид деятельности" param="activity" options={taxonomy.activities} />
      <OptionsSection title="Тип объекта" param="object_type" options={taxonomy.object_types} />
    </aside>
  );
}
