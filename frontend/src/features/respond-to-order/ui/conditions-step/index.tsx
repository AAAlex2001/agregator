"use client";

import classNames from "classnames";
import { useState } from "react";
import { OrderSummaryPanel } from "@/entities/order";
import type { OrderListItem } from "@/entities/order";
import { ChevronIcon } from "@/shared/ui/icons";
import styles from "./style.module.scss";

/** Условия отправки предложения, которые исполнитель читает до заполнения. */
const RESPONSE_TERMS = [
  "Отклик спишется с вашего тарифа сразу после отправки.",
  "Заказчик увидит ваше предложение и сможет связаться с вами в чате.",
  "Если заказчик выберет вас, детали можно будет согласовать напрямую.",
];

/** Заказ, на который откликается исполнитель. */
interface ConditionsStepProps {
  order: OrderListItem;
}

/** Даёт сверить заказ и объясняет, что произойдёт после отклика. */
export function ConditionsStep({ order }: ConditionsStepProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={styles.step}>
      <OrderSummaryPanel order={order} />
      <div className={styles.infoCard}>
        <span className={styles.accentText}>
          Проверьте условия заказа — дальше заполните предложение.
        </span>
        <div className={styles.guaranteesCard}>
          <button
            type="button"
            className={styles.guaranteesToggle}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className={styles.guaranteesTitle}>Что будет дальше</span>
            <ChevronIcon
              className={classNames(styles.guaranteesChevron, {
                [styles.guaranteesChevronOpen]: isOpen,
              })}
              color="var(--color-orange-soft)"
            />
          </button>
          {isOpen && (
            <div className={styles.guaranteesList}>
              {RESPONSE_TERMS.map((term) => (
                <div
                  key={term}
                  className={styles.guaranteeItem}
                >
                  <span
                    className={styles.checkIcon}
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  <span className={styles.guaranteeText}>{term}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}