import cn from "classnames";
import styles from "./style.module.scss";

/** Область аттестации с полным названием для подсказки. */
interface ExpertiseMapAreaProps {
  value: string;
  title: string;
  isSelected: boolean;
  onToggle: (area: string) => void;
}

/** Показывает область аттестации как кнопку фильтра карты. */
export function ExpertiseMapArea({
  value,
  title,
  isSelected,
  onToggle,
}: ExpertiseMapAreaProps) {
  /** Переключает текущую область аттестации. */
  function toggleArea() {
    onToggle(value);
  }

  return (
    <button
      type="button"
      className={cn(styles.chip, {
        [styles.chipActive]: isSelected,
      })}
      onClick={toggleArea}
      title={title}
    >
      {value}
    </button>
  );
}

