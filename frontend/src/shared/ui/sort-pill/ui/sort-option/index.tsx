import cn from "classnames";
import styles from "./style.module.scss";

/** Подпись и выбор одного направления сортировки. */
interface SortOptionProps {
  label: string;
  isChecked: boolean;
  onSelect: () => void;
}

/** Показывает пункт меню с отметкой текущего выбора. */
export function SortOption({
  label,
  isChecked,
  onSelect,
}: SortOptionProps) {
  return (
    <button
      type="button"
      className={styles.option}
      onClick={onSelect}
    >
      <span
        className={cn(
          styles.radio,
          isChecked && styles.radioChecked,
        )}
      >
        {isChecked && <span className={styles.radioDot} />}
      </span>
      <span className={styles.optionText}>{label}</span>
    </button>
  );
}
