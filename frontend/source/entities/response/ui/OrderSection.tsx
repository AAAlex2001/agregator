"use client";

import { useState } from "react";
import { ChevronIcon } from "@/source/shared/ui/icons";
import type { ResponseBadge } from "../model/types";
import s from "./OrderSection.module.scss";

interface Props {
  title: string;
  customer: string;
  date: string;
  badges: ResponseBadge[];
  sum: string;
}

export function OrderSection({ title, customer, date, badges, sum }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className={s.orderSection}>
      <button type="button" className={s.orderTitleRow} onClick={() => setOpen(!open)}>
        <div className={s.titleBlock}>
          <span className={s.label}>Название заказа:</span>
          <span className={s.orderTitle}>{title}</span>
        </div>
        <ChevronIcon className={`${s.chevron} ${open ? s.chevronOpen : ""}`} />
      </button>
      {open && (
        <>
          <div className={s.row}>
            <span className={s.label}>Компания:</span>
            <span className={s.customer}>{customer}</span>
          </div>
          <div className={s.row}>
            <span className={s.label}>Дедлайн:</span>
            <span className={s.value}>{date}</span>
          </div>
          {badges.length > 0 && (
            <div className={s.row}>
              <span className={s.label}>Требования к эксперту:</span>
              <div className={s.badges}>
                {badges.map((b, i) => (
                  <span key={i} className={`${s.badge} ${s[b.variant]}`}>{b.text}</span>
                ))}
              </div>
            </div>
          )}
          <div className={s.row}>
            <span className={s.label}>Начальная максимальная цена:</span>
            <span className={s.orderSum}>{sum}</span>
          </div>
        </>
      )}
    </div>
  );
}
