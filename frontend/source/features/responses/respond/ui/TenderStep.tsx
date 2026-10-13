"use client";

import cn from "classnames";
import { useState } from "react";
import { OrderSummaryPanel, type OrderCardData } from "@/source/entities/order";
import Button from "@/source/shared/ui/Button";
import { ChevronIcon } from "@/source/shared/ui/icons";
import { StepHeader } from "./StepHeader";
import s from "./TenderStep.module.scss";

const GUARANTEES = [
  "Отклик спишется с вашего тарифа сразу после отправки.",
  "Заказчик увидит ваше предложение и сможет связаться с вами в чате.",
  "Если заказчик выберет вас, детали можно будет согласовать напрямую.",
];

interface TenderStepProps {
  order: OrderCardData;
  onBack: () => void;
  onContinue: () => void;
}

/** Шаг 1: исполнитель сверяет условия и читает, что будет после отклика. */
export function TenderStep({ order, onBack, onContinue }: TenderStepProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={s.step}>
      <StepHeader step="Шаг 1. Подтверждение заявки" />
      <OrderSummaryPanel order={order} />

      <div className={s.infoCard}>
        <span className={s.accentText}>Проверьте условия заказа — на следующем шаге заполните предложение.</span>

        <div className={s.guaranteesCard}>
          <button type="button" className={s.guaranteesToggle} onClick={() => setIsOpen(!isOpen)}>
            <span className={s.guaranteesTitle}>Что будет дальше</span>
            <ChevronIcon className={cn(s.guaranteesChevron, { [s.guaranteesChevronOpen]: isOpen })} color="#FFDDA9" />
          </button>

          {isOpen && (
            <div className={s.guaranteesList}>
              {GUARANTEES.map((item) => (
                <div key={item} className={s.guaranteeItem}>
                  <span className={s.checkIcon} aria-hidden="true">
                    ✓
                  </span>
                  <span className={s.guaranteeText}>{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={s.actionRow}>
        <Button variant="outline" size="sm" fullWidth onClick={onBack}>
          Отменить
        </Button>
        <Button variant="primary" size="sm" fullWidth onClick={onContinue}>
          Продолжить
        </Button>
      </div>
    </div>
  );
}
