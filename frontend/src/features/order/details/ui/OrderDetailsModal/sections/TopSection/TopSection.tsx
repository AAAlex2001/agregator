import type { OrderDetails } from "../../types";
import styles from "./topSection.module.scss";

interface TopSectionProps {
  order: OrderDetails;
}

function formatDeadline(isoString: string): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TopSection({ order }: TopSectionProps) {
  const deadlineExpired = order.responsesDeadline
    ? new Date(order.responsesDeadline) <= new Date()
    : false;

  return (
    <div className={styles.top}>
      <div className={styles.dateMoney}>
        <span className={styles.date}>{order.date}</span>
        <div className={styles.badges}>
          {order.badges.map((badge, index) => (
            <span key={index} className={`${styles.badge} ${styles[badge.variant]}`}>
              {badge.text}
            </span>
          ))}
        </div>
        <div className={styles.cash}>
          <span className={styles.sum}>{order.sum}</span>
        </div>
      </div>

      {order.responsesDeadline && (
        <div className={styles.responsesDeadline}>
          <span className={deadlineExpired ? styles.deadlineExpired : styles.deadlineActive}>
            Приём откликов до: {formatDeadline(order.responsesDeadline)}
          </span>
        </div>
      )}

      <div className={styles.orderInfo}>
        <p className={styles.title}>{order.title}</p>
        <p className={styles.customer}>{order.customer}</p>
      </div>
    </div>
  );
}
