import classNames from "classnames";
import styles from "./style.module.scss";

/** Область аттестации и доступность её выбора для текущего объекта экспертизы. */
interface ExpertiseAreaOptionProps {
  area: string;
  active: boolean;
  disabled: boolean;
  onToggle: (area: string) => void;
}

/** Показывает одну область аттестации в сетке экспертных требований. */
export function ExpertiseAreaOption({
  area,
  active,
  disabled,
  onToggle,
}: ExpertiseAreaOptionProps) {
  /** Меняет выбранную область аттестации. */
  function toggle() {
    onToggle(area);
  }

  return (
    <button
      type="button"
      className={classNames(styles.opoBadge, {
        [styles.active]: active,
        [styles.disabled]: disabled,
      })}
      onClick={toggle}
      disabled={disabled}
      aria-pressed={active}
    >
      Э{area}
    </button>
  );
}
