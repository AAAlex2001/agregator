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
        <span className={s.orderTitle}>{title}</span>
        <ChevronIcon className={`${s.chevron} ${open ? s.chevronOpen : ""}`} />
      </button>
      {open && (
        <>
          <span className={s.customer}>{customer}</span>
          <div className={s.orderMeta}>
            <span className={s.orderDate}>{date}</span>
            <div className={s.badges}>
              {badges.map((b, i) => (
                <span key={i} className={`${s.badge} ${s[b.variant]}`}>{b.text}</span>
              ))}
            </div>
            <span className={s.orderSum}>{sum}</span>
          </div>
        </>
      )}
    </div>
  );
}
