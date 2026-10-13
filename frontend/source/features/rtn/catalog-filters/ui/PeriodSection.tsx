"use client";

import { CalendarInput } from "@/source/shared/ui/CalendarInput";
import { useCatalogFilters } from "../model/useCatalogFilters";
import { FilterSection } from "./FilterSection";
import s from "./PeriodSection.module.scss";

/** Период публикации: «с» и «по». */
export function PeriodSection() {
  const { value, setValue } = useCatalogFilters();
  const from = value("published_from");
  const to = value("published_to");

  return (
    <FilterSection title="Период" count={[from, to].filter(Boolean).length}>
      <div className={s.range}>
        <CalendarInput value={from} onChange={(next) => setValue("published_from", next)} placeholder="С даты" />
        <CalendarInput value={to} onChange={(next) => setValue("published_to", next)} placeholder="По дату" />
      </div>
    </FilterSection>
  );
}
