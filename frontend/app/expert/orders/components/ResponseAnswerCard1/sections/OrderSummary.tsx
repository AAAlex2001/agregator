import type { Badge } from "../../OrderDetailsModal/types";
import styles from "./sections.module.scss";

interface OrderSummaryProps {
  title: string;
  customer: string;
  date: string;
  badges: Badge[];
  sum: string;
}

export default function OrderSummary({ title, customer, date, badges, sum }: OrderSummaryProps) {
  const badgeVariantClass: Record<Badge["variant"], string> = {
    blue: styles.badgeBlue,
    green: styles.badgeGreen,
    gray: styles.badgeGray,
    orange: styles.badgeOrange,
    brown: styles.badgeBrown,
    purple: styles.badgePurple,
  };

  return (
    <div className={styles.orderSummary}>
      <div className={styles.orderTitleRow}>
        <span className={styles.orderTitle}>{title}</span>
        <svg className={styles.chevronIcon} viewBox="0 0 24 24" fill="none">
          <path d="M6 9L12 15L18 9" stroke="#FFDDA9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span className={styles.orderCustomer}>{customer}</span>
      <div className={styles.orderMeta}>
        <span className={styles.orderDate}>
          <span className={styles.metaLabel}>Срок выполнения:</span> {date}
        </span>
        <div className={styles.orderBadges}>
          {badges.map((badge) => (
            <span
              key={badge.text}
              className={`${styles.badge} ${badgeVariantClass[badge.variant]}`}
            >
              {badge.text}
            </span>
          ))}
        </div>
        <span className={styles.orderSum}>
          <span className={styles.metaLabel}>Мин. стоимость:</span> {sum}
        </span>
      </div>
    </div>
  );
}
