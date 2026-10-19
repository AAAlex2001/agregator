import type { ReactNode } from "react";
import styles from "./style.module.scss";

/** Текст подсказки и элемент, над которым она появляется. */
interface HoverHintProps {
  label: string;
  children: ReactNode;
}

/**
 * Подсказка над кнопкой-иконкой при наведении и фокусе с клавиатуры.
 * Видна на экранах от 768px: на телефоне наведения нет.
 */
export function HoverHint({ label, children }: HoverHintProps) {
  return (
    <span className={styles.wrap}>
      {children}
      <span
        className={styles.hint}
        aria-hidden="true"
      >
        {label}
      </span>
    </span>
  );
}
