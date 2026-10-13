"use client";

import type { RtnOption } from "@/source/entities/rtn";
import { Checkbox } from "@/source/shared/ui/Checkbox";
import { useCatalogFilters } from "../model/useCatalogFilters";
import { FilterSection } from "./FilterSection";
import s from "./OptionsSection.module.scss";

interface OptionsSectionProps {
  title: string;
  param: string;
  options: RtnOption[];
}

/** Список галочек по одному параметру адреса: отмеченные значения попадают в выдачу. */
export function OptionsSection({ title, param, options }: OptionsSectionProps) {
  const { selected, toggle } = useCatalogFilters();
  const values = selected(param);

  if (options.length === 0) return null;

  return (
    <FilterSection title={title} count={values.length}>
      <div className={s.options}>
        {options.map((option) => (
          <Checkbox
            key={option.value}
            id={`rtn-${param}-${option.value}`}
            checked={values.includes(option.value)}
            onChange={() => toggle(param, option.value)}
          >
            {option.label}
          </Checkbox>
        ))}
      </div>
    </FilterSection>
  );
}
