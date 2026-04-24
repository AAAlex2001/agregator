"use client";

import { useState } from "react";
import { Button } from "@/shared/ui";
import type { OrderCardData } from "@/source/entities/order";
import base from "./sectionBase.module.scss";
import { ModalHeader } from "./ModalHeader";
import { OrderSummaryPanel } from "./OrderSummaryPanel";
import s from "./TenderStep.module.scss";

const GUARANTEES = [
  "Отклик спишется с вашего тарифа сразу после отправки.",
  "Заказчик увидит ваше предложение и сможет связаться с вами в чате.",
  "Если заказчик выберет вас, детали можно будет согласовать напрямую.",
];

interface Props {
  order: OrderCardData;
  onBack: () => void;
  onContinue: () => void;
}

export function TenderStep({ order, onBack, onContinue }: Props) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={base.section}>
      <ModalHeader title="Отклик на заказ" step="Шаг 1. Подтверждение заявки" />
      <OrderSummaryPanel order={order} />

      <div className={s.infoCard}>
        <div className={s.accentRow}>
          <span className={s.accentText}>
            Проверьте условия заказа — на следующем шаге заполните предложение.
          </span>
        </div>

        <div className={s.guaranteesCard}>
          <button type="button" className={s.guaranteesToggle} onClick={() => setIsOpen((prev) => !prev)}>
            <span className={s.guaranteesTitle}>Что будет дальше</span>
            <svg className={`${s.guaranteesChevron} ${isOpen ? s.guaranteesChevronOpen : ""}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 9L12 15L18 9" stroke="#FFDDA9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {isOpen && (
            <div className={s.guaranteesList}>
              {GUARANTEES.map((item) => (
                <div key={item} className={s.guaranteeItem}>
                  <svg className={s.checkIcon} viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M4.17 10L8.33 14.17L15.83 6.67" stroke="#34C759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className={s.guaranteeText}>{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={base.actionRow}>
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
