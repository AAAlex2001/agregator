"use client";

import { useState } from "react";
import { ChatChevronDownIcon } from "@/shared/ui/icons";
import { OrderBadges, type OrderBadge } from "./OrderBadges";
import styles from "./order-banner.module.scss";

interface OrderBannerProps {
  title: string;
  customer: string;
  date: string;
  sum: string;
  badges: OrderBadge[];
}

export function OrderBanner({ title, customer, date, sum, badges }: OrderBannerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.banner}>
      <button
        type="button"
        className={styles.titleRow}
        aria-expanded={open}
        aria-label={open ? "Свернуть" : "Развернуть"}
        onClick={() => setOpen((v) => !v)}
      >
        <p className={styles.title}>{title}</p>
        <ChatChevronDownIcon className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`} />
      </button>
      <div className={`${styles.details} ${open ? styles.detailsOpen : ""}`}>
        <p className={styles.customer}>{customer}</p>
        <div className={styles.meta}>
          <span className={styles.date}>{date}</span>
          <OrderBadges badges={badges} />
          <span className={styles.sum}>{sum}</span>
        </div>
      </div>
    </div>
  );
}
