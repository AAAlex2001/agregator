"use client";

import cn from "classnames";
import { useState } from "react";
import { ChevronIcon } from "@/source/shared/ui/icons";
import type { OrderSummary } from "../model/types";
import s from "./OrderSummaryPanel.module.scss";

interface OrderSummaryPanelProps {
  order: OrderSummary;
}

/** Сворачиваемая шапка с условиями заказа над формой отклика. */
export function OrderSummaryPanel({ order }: OrderSummaryPanelProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={s.card}>
      <button type="button" className={s.toggle} onClick={() => setIsOpen(!isOpen)}>
        <div className={s.titleBlock}>
          <span className={s.metaLabel}>Название заказа</span>
          <span className={s.title}>{order.title}</span>
        </div>
        <ChevronIcon className={cn(s.chevron, { [s.chevronOpen]: isOpen })} color="#FFDDA9" />
      </button>

      {isOpen && (
        <>
          <div className={s.customerBlock}>
            <span className={s.metaLabel}>Организатор</span>
            <span className={s.customer}>{order.customer}</span>
          </div>
          {order.customerInn && (
            <div className={s.customerBlock}>
              <span className={s.metaLabel}>ИНН</span>
              <span className={s.customer}>{order.customerInn}</span>
            </div>
          )}

          <div className={s.meta}>
            <span className={s.metaText}>
              <span className={s.metaLabel}>Срок начала выполнения работ:</span> {order.startDate || "—"}
            </span>
            <span className={s.metaText}>
              <span className={s.metaLabel}>Срок окончания выполнения работ:</span> {order.date}
            </span>
            {order.badges.length > 0 && (
              <div className={s.requirements}>
                <span className={s.metaLabel}>Требования к исполнителю:</span>
                <div className={s.badges}>
                  {order.badges.map((badge) => (
                    <span key={badge.text} className={cn(s.badge, s[badge.variant])}>
                      {badge.text}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <span className={s.metaText}>
              <span className={s.metaLabel}>Начальная максимальная цена:</span> {order.sum}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
