"use client";

import type { RtnTaxonomy } from "@/entities/rtn";
import { useRtnFilters } from "../../model/use-rtn-filters";
import { OptionsSection } from "../options-section";
import { PeriodSection } from "../period-section";
import styles from "./style.module.scss";

/** Доступные справочники для фильтрации каталога РТН. */
interface RtnFiltersProps {
  taxonomy: RtnTaxonomy;
}

/** Собирает фильтры каталога и действие сброса без удаления поисковой строки. */
export function RtnFilters({ taxonomy }: RtnFiltersProps) {
  const { hasFilters, resetFilters } = useRtnFilters();

  return (
    <aside
      className={styles.filters}
      aria-label="Фильтры каталога"
    >
      <div className={styles.head}>
        <h2 className={styles.title}>Фильтры</h2>
        {hasFilters && (
          <button
            type="button"
            className={styles.reset}
            onClick={resetFilters}
          >
            Сбросить всё
          </button>
        )}
      </div>

      <OptionsSection
        title="Тип документа"
        param="document_type"
        options={taxonomy.document_types}
      />
      <OptionsSection
        title="Актуальность"
        param="status"
        options={taxonomy.statuses}
      />
      <PeriodSection />
      <OptionsSection
        title="Область надзора"
        param="oversight_area"
        options={taxonomy.oversight_areas}
      />
      <OptionsSection
        title="Отрасль"
        param="industry"
        options={taxonomy.industries}
      />
      <OptionsSection
        title="Вид деятельности"
        param="activity"
        options={taxonomy.activities}
      />
      <OptionsSection
        title="Тип объекта"
        param="object_type"
        options={taxonomy.object_types}
      />
    </aside>
  );
}
