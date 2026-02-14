import type { OrderDetails } from "../../types";
import styles from "./topSection.module.scss";

interface TopSectionProps {
  order: OrderDetails;
}

export default function TopSection({ order }: TopSectionProps) {
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

      <div className={styles.orderInfo}>
        <p className={styles.title}>{order.title}</p>
        <p className={styles.customer}>{order.customer}</p>
      </div>
    </div>
  );
}
