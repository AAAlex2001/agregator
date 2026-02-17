"use client";

import { useState } from "react";
import { ChevronIcon } from "@/app/icons";
import type { ResponseBadge } from "../../types";
import styles from "./orderSection.module.scss";

interface OrderSectionProps {
  orderTitle: string;
  customer: string;
  orderDate: string;
  badges: ResponseBadge[];
  sum: string;
  collapsible?: boolean;
  hideDividerOnDesktop?: boolean;
}

const OrderSection = ({
  orderTitle,
  customer,
  orderDate,
  badges,
  sum,
  collapsible = false,
  hideDividerOnDesktop = false,
}: OrderSectionProps) => {
  const [expanded, setExpanded] = useState(false);
  const showMeta = collapsible ? expanded : true;

  return (
    <div className={`${styles.orderSection} ${hideDividerOnDesktop ? styles.noDividerDesktop : ""}`}>
      <button
        type="button"
        className={styles.orderTitleRow}
        onClick={() => {
          if (!collapsible) {
            return;
          }
          setExpanded((prev) => !prev);
        }}
      >
        <span className={styles.orderTitle}>{orderTitle}</span>
        <ChevronIcon className={`${styles.chevron} ${showMeta ? styles.chevronExpanded : ""}`} />
      </button>
      {showMeta && (
        <>
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
        </>
      )}
    </div>
  );
};

export default OrderSection;
