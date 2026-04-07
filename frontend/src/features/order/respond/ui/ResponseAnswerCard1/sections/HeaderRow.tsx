import styles from "./sections.module.scss";

export default function HeaderRow() {
  return (
    <div className={styles.headerRow}>
      <span className={styles.headerTitle}>Отклик на заказ</span>
      <span className={styles.headerStep}>Шаг 1. Участие в тендере</span>
    </div>
  );
}
