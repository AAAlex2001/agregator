import { DiffValue } from "@/shared/ui/diff-value";
import styles from "./style.module.scss";

/** Подпись комментария заказа и его прежняя редакция. */
interface OrderCommentProps {
  title?: string;
  text: string;
  previous?: string | null;
}

/** Показывает комментарий и выделяет внесённое изменение. */
export function OrderComment({
  title = "Комментарий заказчика:",
  text,
  previous,
}: OrderCommentProps) {
  return (
    <div className={styles.row}>
      <span className={styles.title}>{title}</span>
      <span className={styles.text}>
        <DiffValue
          previous={previous}
          current={text}
        />
      </span>
    </div>
  );
}
