"use client";

import { useState } from "react";
import type { Badge, OrderCardData } from "@/source/entities/order";
import s from "./OrderSummaryPanel.module.scss";

const BADGE_CLASS: Record<Badge["variant"], string> = {
  blue: s.badgeBlue,
  green: s.badgeGreen,
  gray: s.badgeGray,
  orange: s.badgeOrange,
  brown: s.badgeBrown,
  purple: s.badgePurple,
};

interface Props {
  order: OrderCardData;
}

export function OrderSummaryPanel({ order }: Props) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={s.card}>
      <button type="button" className={s.toggle} onClick={() => setIsOpen((prev) => !prev)}>
        <div className={s.titleBlock}>
          <span className={s.metaLabel}>Название заказа</span>
          <span className={s.title}>{order.title}</span>
        </div>
        <svg className={`${s.chevron} ${isOpen ? s.chevronOpen : ""}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 9L12 15L18 9" stroke="#FFDDA9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className={s.customerBlock}>
            <span className={s.metaLabel}>Организатор</span>
            <span className={s.customer}>{order.customer}</span>
          </div>

          <div className={s.meta}>
            <span className={s.metaText}>
              <span className={s.metaLabel}>Срок выполнения до:</span> {order.date}
            </span>

            {order.badges.length > 0 && (
              <div className={s.requirements}>
                <span className={s.metaLabel}>Требования к эксперту:</span>
                <div className={s.badges}>
                  {order.badges.map((badge, index) => (
                    <span key={`${badge.text}-${index}`} className={`${s.badge} ${BADGE_CLASS[badge.variant]}`}>
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