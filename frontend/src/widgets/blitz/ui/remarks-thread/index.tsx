import { BlitzDocuments } from "@/entities/blitz-order";
import type { BlitzRemark } from "@/entities/blitz-order";
import { formatWithTime } from "@/shared/lib/format-date";
import styles from "./style.module.scss";

/** Раунды замечаний заявки. */
interface RemarksThreadProps {
  orderId: number;
  remarks: BlitzRemark[];
}

/** Замечания эксперта и ответы заказчика по раундам: текст и файлы обеих сторон. */
export function RemarksThread({ orderId, remarks }: RemarksThreadProps) {
  return (
    <ol className={styles.thread}>
      {remarks.map((remark, index) => (
        <li
          key={remark.id}
          className={styles.round}
        >
          <div className={styles.head}>
            <span className={styles.title}>Замечания №{index + 1}</span>
            <span className={remark.resolved_at ? styles.resolved : styles.open}>
              {remark.resolved_at ? "Исправления отправлены" : "Ждём исправления"}
            </span>
          </div>
          <span className={styles.date}>{formatWithTime(remark.created_at)}</span>
          {remark.text && <p className={styles.text}>{remark.text}</p>}
          {remark.response_text && (
            <p className={styles.response}>Ответ заказчика: {remark.response_text}</p>
          )}
          {remark.documents.length > 0 && (
            <BlitzDocuments
              orderId={orderId}
              documents={remark.documents}
            />
          )}
        </li>
      ))}
    </ol>
  );
}
