"use client";

import { useState, type ReactNode, type SyntheticEvent } from "react";
import { CalendarInput } from "@/source/shared/ui/CalendarInput";
import { Checkbox } from "@/source/shared/ui/Checkbox";
import { ChevronIcon } from "@/source/shared/ui/icons";
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

function CollapsibleSection({
  title,
  count,
  children,
}: {
  title: string;
  count?: number;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const onToggle = (event: SyntheticEvent<HTMLDetailsElement>) => setOpen(event.currentTarget.open);

  return (
    <details className={s.section} open={open} onToggle={onToggle}>
      <summary className={s.sectionTitle}>
        <span className={s.sectionTitleText}>
          {title}
          {Boolean(count) && <span className={s.sectionCount}>{count}</span>}
        </span>
        <ChevronIcon className={s.chevron} color="#9aa1ad" />
      </summary>
      {children}
    </details>
  );
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
    <CollapsibleSection title={title} count={selected.length}>
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
    </CollapsibleSection>
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

      <CollapsibleSection title="Тип документа">
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
      </CollapsibleSection>

      <CollapsibleSection title="Актуальность">
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
      </CollapsibleSection>

      <CollapsibleSection title="Период">
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
      </CollapsibleSection>

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
