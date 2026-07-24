"use client";

import { CalendarInput } from "@/source/shared/ui/CalendarInput";
import { Checkbox } from "@/source/shared/ui/Checkbox";
import { DOCUMENT_TYPE_LABELS, STATUS_LABELS } from "@/source/entities/rtn-clarification";
import type {
  RtnDocumentType,
  RtnListFilters,
  RtnStatus,
  RtnTaxonomy,
  RtnTaxonomyOption,
} from "@/source/entities/rtn-clarification";
import type { TaxonomyDimension } from "../model/useRtnCatalogFilters";
import s from "./RtnFilters.module.scss";

interface Props {
  taxonomy: RtnTaxonomy;
  filters: RtnListFilters;
  onToggleDocumentType: (value: RtnDocumentType) => void;
  onToggleStatus: (value: RtnStatus) => void;
  onToggleTaxonomy: (dimension: TaxonomyDimension, value: string) => void;
  onDateRangeChange: (from: string, to: string) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

function TaxonomySection({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: RtnTaxonomyOption[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  if (options.length === 0) return null;
  return (
    <details className={s.section} open={selected.length > 0}>
      <summary className={s.sectionTitle}>
        {title}
        {selected.length > 0 && <span className={s.sectionCount}>{selected.length}</span>}
      </summary>
      <div className={s.optionsList}>
        {options.map((option) => (
          <Checkbox
            key={option.value}
            id={`rtn-filter-${title}-${option.value}`}
            checked={selected.includes(option.value)}
            onChange={() => onToggle(option.value)}
          >
            {option.label}
          </Checkbox>
        ))}
      </div>
    </details>
  );
}

export function RtnFilters({
  taxonomy,
  filters,
  onToggleDocumentType,
  onToggleStatus,
  onToggleTaxonomy,
  onDateRangeChange,
  onReset,
  hasActiveFilters,
}: Props) {
  const dateFrom = filters.publishedFrom ?? "";
  const dateTo = filters.publishedTo ?? "";
  return (
    <aside className={s.filters} aria-label="Фильтры каталога">
      <div className={s.filtersHead}>
        <h2 className={s.filtersTitle}>Фильтры</h2>
        {hasActiveFilters && (
          <button type="button" className={s.reset} onClick={onReset}>
            Сбросить всё
          </button>
        )}
      </div>

      <details className={s.section} open>
        <summary className={s.sectionTitle}>Тип документа</summary>
        <div className={s.optionsList}>
          {taxonomy.document_types.map((option) => (
            <Checkbox
              key={option.value}
              id={`rtn-filter-doc-${option.value}`}
              checked={(filters.documentTypes ?? []).includes(option.value as RtnDocumentType)}
              onChange={() => onToggleDocumentType(option.value as RtnDocumentType)}
            >
              {DOCUMENT_TYPE_LABELS[option.value as RtnDocumentType] ?? option.label}
            </Checkbox>
          ))}
        </div>
      </details>

      <details className={s.section} open>
        <summary className={s.sectionTitle}>Актуальность</summary>
        <div className={s.optionsList}>
          {taxonomy.statuses.map((option) => (
            <Checkbox
              key={option.value}
              id={`rtn-filter-status-${option.value}`}
              checked={(filters.statuses ?? []).includes(option.value as RtnStatus)}
              onChange={() => onToggleStatus(option.value as RtnStatus)}
            >
              {STATUS_LABELS[option.value as RtnStatus] ?? option.label}
            </Checkbox>
          ))}
        </div>
      </details>

      <details className={s.section} open={Boolean(dateFrom || dateTo)}>
        <summary className={s.sectionTitle}>Период</summary>
        <div className={s.dateRange}>
          <CalendarInput
            value={dateFrom}
            onChange={(value) => onDateRangeChange(value, dateTo)}
            placeholder="С даты"
          />
          <CalendarInput
            value={dateTo}
            onChange={(value) => onDateRangeChange(dateFrom, value)}
            placeholder="По дату"
          />
        </div>
      </details>

      <TaxonomySection
        title="Область надзора"
        options={taxonomy.oversight_areas}
        selected={filters.oversightAreas ?? []}
        onToggle={(value) => onToggleTaxonomy("oversightAreas", value)}
      />
      <TaxonomySection
        title="Отрасль"
        options={taxonomy.industries}
        selected={filters.industries ?? []}
        onToggle={(value) => onToggleTaxonomy("industries", value)}
      />
      <TaxonomySection
        title="Вид деятельности"
        options={taxonomy.activities}
        selected={filters.activities ?? []}
        onToggle={(value) => onToggleTaxonomy("activities", value)}
      />
      <TaxonomySection
        title="Тип объекта"
        options={taxonomy.object_types}
        selected={filters.objectTypes ?? []}
        onToggle={(value) => onToggleTaxonomy("objectTypes", value)}
      />
    </aside>
  );
}
