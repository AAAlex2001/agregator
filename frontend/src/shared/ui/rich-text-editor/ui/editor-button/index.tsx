import type { ReactNode } from "react";
import { HoverHint } from "@/shared/ui/hover-hint";
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

/** Квадратная кнопка панели инструментов редактора; подпись видна при наведении. */
export function EditorButton({
  label,
  children,
  pressed,
  expanded,
  disabled,
  onClick,
}: EditorButtonProps) {
  return (
    <HoverHint label={label}>
      <button
        type="button"
        className={styles.tool}
        aria-label={label}
        aria-pressed={pressed}
        aria-expanded={expanded}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
    </HoverHint>
  );
}
