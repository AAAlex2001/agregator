"use client";

import { useState } from "react";
import type { ChatBadge } from "@/source/entities/chat";
import { ChatChevronDownIcon } from "@/source/shared/ui/icons";
import s from "./ChatOrderBanner.module.scss";

interface ChatOrderBannerProps {
  title: string;
  customer: string;
  date: string;
  sum: string;
  badges: ChatBadge[];
}

export function ChatOrderBanner({ title, customer, date, sum, badges }: ChatOrderBannerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={s.banner}>
      <button
        type="button"
        className={s.titleRow}
        aria-expanded={open}
        aria-label={open ? "Свернуть" : "Развернуть"}
        onClick={() => setOpen((value) => !value)}
      >
        <p className={s.title}>{title}</p>
        <ChatChevronDownIcon className={`${s.chevron} ${open ? s.chevronOpen : ""}`.trim()} />
      </button>

      <div className={`${s.details} ${open ? s.detailsOpen : ""}`.trim()}>
        <p className={s.customer}>{customer}</p>
        <div className={s.meta}>
          <span className={s.date}>{date}</span>
          <div className={s.badges}>
            {badges.map((badge, index) => (
              <span key={`${badge.text}-${index}`} className={s.badge} data-variant={badge.variant}>
                {badge.text}
              </span>
            ))}
          </div>
          <span className={s.sum}>{sum}</span>
        </div>
      </div>
    </div>
  );
}