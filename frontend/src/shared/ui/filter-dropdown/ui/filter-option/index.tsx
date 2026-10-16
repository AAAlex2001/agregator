import cn from "classnames";
import type { FilterDropdownOption } from "../../model/types";
import styles from "./style.module.scss";

/** Один вариант фильтра с отметкой выбора. */
interface FilterOptionProps {
  option: FilterDropdownOption;
  isSelected: boolean;
  onToggle: (value: string) => void;
}

/** Показывает сокращение, название и выбранное состояние варианта. */
export function FilterOption({
  option,
  isSelected,
  onToggle,
}: FilterOptionProps) {
  /** Передаёт выбранное значение владельцу фильтра. */
  function toggleOption() {
    onToggle(option.value);
  }

  return (
    <button
      type="button"
      role="option"
      aria-selected={isSelected}
      className={cn(styles.option, {
        [styles.optionActive]: isSelected,
      })}
      onClick={toggleOption}
    >
      {option.short && (
        <span className={styles.optionShort}>{option.short}</span>
      )}

      <span className={styles.optionTitle}>{option.title}</span>

      {isSelected && (
        <span
          className={styles.optionCheck}
          aria-hidden="true"
        >
          ✓
        </span>
      )}
    </button>
  );
}
