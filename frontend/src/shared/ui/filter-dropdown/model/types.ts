/** Вариант фильтра с полным названием и необязательным сокращением. */
export interface FilterDropdownOption {
  value: string;
  title: string;
  short?: string;
}

/** Управляемый выбор нескольких вариантов в раскрывающемся фильтре. */
export interface FilterDropdownProps {
  label: string;
  options: FilterDropdownOption[];
  selected: string[];
  onToggle: (value: string) => void;
}
