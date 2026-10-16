import type { RtnOption } from "@/entities/rtn";
import type { RtnOptionFilter } from "../../model/types";
import { useRtnFilters } from "../../model/use-rtn-filters";
import { FilterOption } from "../filter-option";
import { FilterSection } from "../filter-section";
import styles from "./style.module.scss";

/** Справочник и имя параметра, в котором хранятся выбранные пункты. */
interface OptionsSectionProps {
  title: string;
  param: RtnOptionFilter;
  options: RtnOption[];
}

/** Показывает флажки одного справочника, если в нём есть доступные значения. */
export function OptionsSection({ title, param, options }: OptionsSectionProps) {
  const { selectedValues, toggleOption } = useRtnFilters();
  const selected = selectedValues(param);

  if (options.length === 0) {
    return null;
  }

  return (
    <FilterSection
      title={title}
      count={selected.length}
    >
      <div className={styles.options}>
        {options.map((option) => (
          <FilterOption
            key={option.value}
            param={param}
            option={option}
            checked={selected.includes(option.value)}
            onToggle={toggleOption}
          />
        ))}
      </div>
    </FilterSection>
  );
}
