"use client";

import classNames from "classnames";
import { useState } from "react";
import { OrderSummaryPanel } from "@/entities/order";
import type { OrderListItem } from "@/entities/order";
import { Button } from "@/shared/ui/button";
import { ChevronIcon } from "@/shared/ui/icons";
import { StepHeader } from "../step-header";
import styles from "./style.module.scss";

/** Условия отправки предложения, которые исполнитель читает до заполнения. */
const RESPONSE_TERMS = [
  "Отклик спишется с вашего тарифа сразу после отправки.",
  "Заказчик увидит ваше предложение и сможет связаться с вами в чате.",
  "Если заказчик выберет вас, детали можно будет согласовать напрямую.",
];

/** Заказ и переходы между просмотром условий и заполнением предложения. */
interface ConfirmationStepProps {
  order: OrderListItem;
  onBack: () => void;
  onContinue: () => void;
}

/** Даёт сверить заказ и объясняет, что произойдёт после отклика. */
export function ConfirmationStep({
  order,
  onBack,
  onContinue,
}: ConfirmationStepProps) {
  const [isOpen, setIsOpen] = useState(true);

  /** Сворачивает или раскрывает пояснение о дальнейших действиях. */
  function toggleTerms() {
    setIsOpen(!isOpen);
  }

  return (
    <div className={styles.step}>
      <StepHeader step="Шаг 1. Подтверждение заявки" />
      <OrderSummaryPanel order={order} />

      <div className={styles.infoCard}>
        <span className={styles.accentText}>
          Проверьте условия заказа — на следующем шаге заполните предложение.
        </span>

        <div className={styles.guaranteesCard}>
          <button
            type="button"
            className={styles.guaranteesToggle}
            onClick={toggleTerms}
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

      <div className={styles.actionRow}>
        <Button
          variant="outline"
          size="sm"
          fullWidth
          onClick={onBack}
        >
          Отменить
        </Button>
        <Button
          variant="primary"
          size="sm"
          fullWidth
          onClick={onContinue}
        >
          Продолжить
        </Button>
      </div>
    </div>
  );
}
