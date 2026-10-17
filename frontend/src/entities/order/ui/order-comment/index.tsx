import styles from "./style.module.scss";

/** Подпись и текст комментария. */
interface OrderCommentProps {
  title?: string;
  text: string;
}

/** Показывает комментарий с подписью слева. */
export function OrderComment({
  title = "Комментарий заказчика:",
  text,
}: OrderCommentProps) {
  return (
    <div className={styles.row}>
      <span className={styles.title}>{title}</span>
      <span className={styles.text}>{text}</span>
    </div>
  );
}
