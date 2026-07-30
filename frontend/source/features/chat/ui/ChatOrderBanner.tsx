"use client";

import Link from "next/link";
import { useState } from "react";
import type { ChatBadge, ChatResponseStatus } from "@/source/entities/chat";
import { ChatChevronDownIcon } from "@/source/shared/ui/icons";
import s from "./ChatOrderBanner.module.scss";

interface ChatOrderBannerProps {
  title: string;
  customer: string;
  date: string;
  sum: string;
  badges: ChatBadge[];
  responseStatus: ChatResponseStatus | null;
}

const STATUS_TO_TAB: Record<ChatResponseStatus, string> = {
  REVIEW: "review",
  IN_PROGRESS: "in_progress",
  REJECTED: "rejected",
  ACCEPTED: "accepted",
  COMPLETED: "completed",
};

export function ChatOrderBanner({ title, customer, date, sum, badges, responseStatus }: ChatOrderBannerProps) {
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

      {open ? (
        <div className={s.details}>
          <p className={s.customer}>{customer}</p>
          <div className={s.meta}>
            <span className={s.date}>{date}</span>
            <span className={s.sum}>{sum}</span>
          </div>
          {badges.length > 0 ? (
            <div className={s.requirements}>
              <span className={s.requirementsLabel}>Требования к исполнителю:</span>
              <div className={s.badges}>
                {badges.map((badge, index) => (
                  <span key={`${badge.text}-${index}`} className={s.badge} data-variant={badge.variant}>
                    {badge.text}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
          {responseStatus ? (
            <p className={s.orderLinkRow}>
              Ссылка на заказ:{" "}
              <Link href={`/responses?tab=${STATUS_TO_TAB[responseStatus]}`} className={s.orderLink}>
                открыть
              </Link>
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
