import type {
  DirectionCode,
  DirectionOption as Direction,
} from "@/entities/direction";
import { Checkbox } from "@/shared/ui/checkbox";
import styles from "./style.module.scss";

/** Направление без анкеты и текущее состояние его отметки. */
interface DirectionOptionProps {
  direction: Direction;
  checked: boolean;
  onToggle: (direction: DirectionCode) => void;
}

/** Показывает отметку направления с названием и описанием работ. */
export function DirectionOption({
  direction,
  checked,
  onToggle,
}: DirectionOptionProps) {
  /** Передаёт выбранное направление форме сохранения. */
  function toggleDirection() {
    onToggle(direction.value);
  }

  return (
    <li className={styles.item}>
      <Checkbox
        id={`direction-mark-${direction.value.toLowerCase()}`}
        checked={checked}
        onChange={toggleDirection}
      >
        <span className={styles.title}>{direction.label}</span>
        <span className={styles.text}>{direction.description}</span>
      </Checkbox>
    </li>
  );
}
