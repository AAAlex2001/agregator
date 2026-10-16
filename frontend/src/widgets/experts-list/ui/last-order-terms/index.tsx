import type { ExpertLastOrder } from "@/entities/expert";
import styles from "./style.module.scss";

/** Последний выполненный заказ с ценами и сроками. */
interface LastOrderTermsProps {
  order: ExpertLastOrder;
}

/** Показывает цены и сроки заказчика и принятого предложения исполнителя. */
export function LastOrderTerms({ order }: LastOrderTermsProps) {
  return (
    <>
      <div className={styles.field}>
        <span className={styles.label}>Начальная максимальная цена</span>
        <span className={styles.accent}>{order.sum || "Не определено"}</span>
      </div>
      {order.executor_proposed_sum && (
        <div className={styles.field}>
          <span className={styles.label}>Цена исполнителя</span>
          <span className={styles.value}>{order.executor_proposed_sum}</span>
        </div>
      )}
      {order.executor_proposed_start_date && (
        <div className={styles.field}>
          <span className={styles.label}>Срок начала выполнения работ исполнителя</span>
          <span className={styles.value}>{order.executor_proposed_start_date}</span>
        </div>
      )}
      {order.executor_proposed_deadline && (
        <div className={styles.field}>
          <span className={styles.label}>Срок окончания выполнения работ исполнителя</span>
          <span className={styles.value}>{order.executor_proposed_deadline}</span>
        </div>
      )}
      <div className={styles.field}>
        <span className={styles.label}>Срок начала выполнения работ</span>
        <span className={styles.value}>{order.start_date || "—"}</span>
      </div>
      <div className={styles.field}>
        <span className={styles.label}>Срок окончания выполнения работ</span>
        <span className={styles.value}>{order.date || "—"}</span>
      </div>
    </>
  );
}
