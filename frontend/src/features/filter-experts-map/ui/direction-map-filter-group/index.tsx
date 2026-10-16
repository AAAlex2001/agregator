import { FilterDropdown } from "@/shared/ui/filter-dropdown";
import type { MapFilterGroup } from "../../model/types";

/** Выбор параметров одной группы фильтров направления. */
interface DirectionMapFilterGroupProps {
  group: MapFilterGroup;
  selected: string[];
  onToggle: (label: string, value: string) => void;
}

/** Передаёт выбранное значение вместе с названием его группы. */
export function DirectionMapFilterGroup({
  group,
  selected,
  onToggle,
}: DirectionMapFilterGroupProps) {
  /** Переключает один параметр текущей группы. */
  function toggleValue(value: string) {
    onToggle(group.label, value);
  }

  return (
    <FilterDropdown
      label={group.label}
      options={group.options}
      selected={selected}
      onToggle={toggleValue}
    />
  );
}

