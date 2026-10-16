import type { ReactNode } from "react";
import styles from "./style.module.scss";

/** Пояснение под полями формы. */
interface FieldNoteProps {
  children: ReactNode;
}

/** Показывает короткую серую подсказку под полями. */
export function FieldNote({ children }: FieldNoteProps) {
  return <span className={styles.note}>{children}</span>;
}
