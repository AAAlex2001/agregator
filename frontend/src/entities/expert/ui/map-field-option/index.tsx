import cn from "classnames";
import type { ExpertMapFieldOption } from "../../model/types";
import styles from "./style.module.scss";

/** Один доступный признак карты и его текущее выбранное состояние. */
interface MapFieldOptionProps {
  option: ExpertMapFieldOption;
  selected: boolean;
  onToggle: (field: string) => void;
}

/** Переключает отображение одного поля анкеты на карте. */
export function MapFieldOption({ option, selected, onToggle }: MapFieldOptionProps) {
  return (
    <button
      type="button"
      className={cn(styles.option, {
        [styles.optionActive]: selected,
      })}
      aria-pressed={selected}
      onClick={() => onToggle(option.value)}
    >
      {option.label}
    </button>
  );
}
