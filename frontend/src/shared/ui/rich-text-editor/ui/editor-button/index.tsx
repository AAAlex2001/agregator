import type { ReactNode } from "react";
import styles from "./style.module.scss";

/** Подпись, иконка, состояние и действие кнопки панели редактора. */
interface EditorButtonProps {
  label: string;
  children: ReactNode;
  pressed?: boolean;
  expanded?: boolean;
  disabled: boolean;
  onClick: () => void;
}

/** Квадратная кнопка панели инструментов редактора. */
export function EditorButton({
  label,
  children,
  pressed,
  expanded,
  disabled,
  onClick,
}: EditorButtonProps) {
  return (
    <button
      type="button"
      className={styles.tool}
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      aria-expanded={expanded}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
