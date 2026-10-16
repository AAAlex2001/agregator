"use client";

import classNames from "classnames";
import { useState } from "react";
import { ChevronIcon } from "@/shared/ui/icons";
import { getOrderBadgeColor } from "../../model/badge-color";
import type { OrderSummary } from "../../model/order-summary";
import styles from "./style.module.scss";

/** Основные условия заказа над формой предложения. */
interface OrderSummaryPanelProps {
  order: OrderSummary;
}

/** Сворачивает основные условия заказа, оставляя видимым его название. */
export function OrderSummaryPanel({ order }: OrderSummaryPanelProps) {
  const [isOpen, setIsOpen] = useState(true);

  /** Показывает или скрывает сроки, организатора, требования и цену. */
  function toggleSummary() {
    setIsOpen(!isOpen);
  }

  return (
    <div className={styles.card}>
      <button
        type="button"
        className={styles.toggle}
        onClick={toggleSummary}
      >
        <div className={styles.titleBlock}>
          <span className={styles.metaLabel}>Название заказа</span>
          <span className={styles.title}>{order.title}</span>
        </div>
        <ChevronIcon
          className={classNames(styles.chevron, {
            [styles.chevronOpen]: isOpen,
          })}
          color="var(--color-orange-soft)"
        />
      </button>

      {isOpen && (
        <>
          <div className={styles.customerBlock}>
            <span className={styles.metaLabel}>Организатор</span>
            <span className={styles.customer}>
              {order.company || order.customer_name}
            </span>
          </div>
          {order.customer_inn && (
            <div className={styles.customerBlock}>
              <span className={styles.metaLabel}>ИНН</span>
              <span className={styles.customer}>{order.customer_inn}</span>
            </div>
          )}

          <div className={styles.meta}>
            <span className={styles.metaText}>
              <span className={styles.metaLabel}>Срок начала выполнения работ:</span>{" "}
              {order.start_date || "—"}
            </span>
            <span className={styles.metaText}>
              <span className={styles.metaLabel}>Срок окончания выполнения работ:</span>{" "}
              {order.date}
            </span>
            {order.badges.length > 0 && (
              <div className={styles.requirements}>
                <span className={styles.metaLabel}>Требования к исполнителю:</span>
                <div className={styles.badges}>
                  {order.badges.map((badge) => (
                    <span
                      key={badge.text}
                      className={classNames(
                        styles.badge,
                        styles[getOrderBadgeColor(badge.variant)],
                      )}
                    >
                      {badge.text}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <span className={styles.metaText}>
              <span className={styles.metaLabel}>Начальная максимальная цена:</span>{" "}
              {order.sum}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
