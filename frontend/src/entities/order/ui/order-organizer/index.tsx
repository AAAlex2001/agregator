import styles from "./style.module.scss";

/** Название и ИНН организатора заказа. */
interface OrderOrganizerProps {
  name: string;
  inn: string;
}

/** Показывает организатора и его реквизиты. */
export function OrderOrganizer({ name, inn }: OrderOrganizerProps) {
  return (
    <div className={styles.bottom}>
      <span className={styles.label}>Организатор</span>
      <span className={styles.value}>{name || "—"}</span>
      {inn && <span className={styles.inn}>ИНН {inn}</span>}
    </div>
  );
}
