import type { ReactNode } from "react";
import styles from "./style.module.scss";

/** Заголовок шага, пояснение и действия под ним. */
interface StepNoteProps {
  title: string;
  text?: ReactNode;
  children?: ReactNode;
}

/** Карточка текущего шага: что происходит и что сделать. */
export function StepNote({ title, text, children }: StepNoteProps) {
  return (
    <section className={styles.note}>
      <h2 className={styles.title}>{title}</h2>
      {text && <p className={styles.text}>{text}</p>}
      {children}
    </section>
  );
}
