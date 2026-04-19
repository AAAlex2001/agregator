"use client";

import { useState } from "react";
import { Button } from "@/shared/ui";
import type { OrderCardData } from "@/source/entities/order";
import { ModalHeader } from "./ModalHeader";
import { OrderSummaryPanel } from "./OrderSummaryPanel";
import s from "./orderFlow.module.scss";

const GUARANTEES = [
  "При выборе вашей кандидатуры спишется только 5% от вашей цены, остаток вернётся на счёт",
  "При отклонении заказчиком вашей кандидатуры средства возвращаются в полном объёме",
  "Все возвраты выполняются автоматически в течение 1-10 рабочих дней",
];

interface Props {
  order: OrderCardData;
  balance: number;
  onBack: () => void;
  onContinue: () => void;
  onTopUp: () => void;
}

function formatBalance(value: number) {
  return `${Math.floor(value / 100).toLocaleString("ru-RU")} ₽`;
}

export function TenderStep({ order, balance, onBack, onContinue, onTopUp }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const needsTopUp = order.commissionAmountRaw > 0 && balance < order.commissionAmountRaw;
  const isUndefined = order.commissionAmount === "Не определено" || order.commissionAmount === "0 ₽" || order.commissionAmount === "0 ₽";

  return (
    <div className={s.stepStack}>
      <ModalHeader title="Отклик на заказ" step="Шаг 1. Участие в тендере" />
      <OrderSummaryPanel order={order} />

      <div className={s.infoCard}>
        <div className={s.commissionRow}>
          <span className={s.accentText}>
            {isUndefined
              ? "Бюджет заказа не определён. Взнос 5% будет рассчитан от вашей предложенной стоимости."
              : "Для подачи заявки требуется взнос 5% от суммы заказа:"}
          </span>
          {!isUndefined && <span className={s.commissionValue}>{order.commissionAmount}</span>}
        </div>

        <div className={s.guaranteesCard}>
          <button type="button" className={s.guaranteesToggle} onClick={() => setIsOpen((prev) => !prev)}>
            <span className={s.guaranteesTitle}>Ваши гарантии</span>
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

        <div className={s.balanceRow}>
          <div className={s.balanceInfo}>
            <span className={s.balanceLabel}>На вашем счёте:</span>
            <span className={s.balanceValue}>{formatBalance(balance)}</span>
          </div>

          <Button variant="secondary" size="sm" onClick={onTopUp} disabled={!needsTopUp}>
            Пополнить баланс
          </Button>
        </div>

        {needsTopUp && <span className={s.expiredHint}>Недостаточно средств для подачи заявки</span>}
      </div>

      <div className={s.actionRow}>
        <Button variant="outline" size="sm" fullWidth onClick={onBack}>
          Отменить
        </Button>
        <Button variant="primary" size="sm" fullWidth disabled={needsTopUp} onClick={onContinue}>
          Оплатить участие
        </Button>
      </div>
    </div>
  );
}