import { formatMoscowDateTime } from "@/shared/lib/format-date";
import styles from "./style.module.scss";

/** Сроки и бюджет, отображаемые в публичном заказе. */
interface OrderMetaProps {
  startDate: string;
  endDate: string;
  budget: string;
  responsesDeadline: string | null;
}

/** Показывает бюджет и сроки; время приёма откликов указано по Москве. */
export function OrderMeta({
  startDate,
  endDate,
  budget,
  responsesDeadline,
}: OrderMetaProps) {
  return (
    <div className={styles.meta}>
      <div className={styles.metaItem}>
        <span className={styles.metaLabel}>Срок начала выполнения работ</span>
        <span className={styles.metaValue}>{startDate || "—"}</span>
      </div>
      <div className={styles.metaItem}>
        <span className={styles.metaLabel}>Срок окончания выполнения работ</span>
        <span className={styles.metaValue}>{endDate}</span>
      </div>
      <div className={styles.metaItem}>
        <span className={styles.metaLabel}>Бюджет</span>
        <span className={styles.metaValue}>{budget}</span>
      </div>
      {responsesDeadline && (
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Приём откликов до (МСК)</span>
          <span className={styles.metaValue}>
            {formatMoscowDateTime(responsesDeadline)}
          </span>
        </div>
      )}
    </div>
  );
}
