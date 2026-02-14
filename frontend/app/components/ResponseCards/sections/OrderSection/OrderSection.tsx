"use client";

import { ChevronIcon } from "@/app/icons";
import type { ResponseBadge } from "../../types";
import styles from "./orderSection.module.scss";

interface OrderSectionProps {
  orderTitle: string;
  customer: string;
  orderDate: string;
  badges: ResponseBadge[];
  sum: string;
}

const OrderSection = ({
  orderTitle,
  customer,
  orderDate,
  badges,
  sum,
}: OrderSectionProps) => (
  <div className={styles.orderSection}>
    <div className={styles.orderTitleRow}>
      <span className={styles.orderTitle}>{orderTitle}</span>
      <ChevronIcon className={styles.chevron} />
    </div>
    <span className={styles.customer}>{customer}</span>
    <div className={styles.orderMeta}>
      <span className={styles.orderDate}>{orderDate}</span>
      <div className={styles.badges}>
        {badges.map((badge, index) => (
          <span
            key={index}
            className={`${styles.badge} ${styles[badge.variant]}`}
          >
            {badge.text}
          </span>
        ))}
      </div>
      <div className={styles.cash}>
        <span className={styles.sum}>{sum}</span>
      </div>
    </div>
  </div>
);

export default OrderSection;
