import type { FilterDropdownOption } from "@/shared/ui/filter-dropdown";

/** Группа параметров для отбора исполнителей одного направления. */
export interface MapFilterGroup {
  label: string;
  options: FilterDropdownOption[];
}

/** Выбранные значения одной группы; название сохраняет выбор при смене направления. */
export interface MapFilterSelection {
  label: string;
  values: string[];
}

/** Размер карты и адрес покупки контактов, заданные страницей. */
export interface ExpertsMapOptions {
  height?: number | string;
  contactsHref?: string;
}
