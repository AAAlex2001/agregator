"use client";

import cn from "classnames";
import { useState } from "react";
import { formatWithTime } from "@/source/shared/lib/formatDate";
import { ChatChevronDownIcon } from "@/source/shared/ui/icons";
import { CATEGORY_LABEL, type TicketSummary } from "../model/types";
import { StatusBadge } from "./StatusBadge";
import s from "./TicketHeader.module.scss";

interface TicketHeaderProps {
  ticket: TicketSummary;
}

/** Шапка переписки: номер, тема и статус; по клику раскрываются категория и даты. */
export function TicketHeader({ ticket }: TicketHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={s.banner}>
      <button
        type="button"
        className={s.titleRow}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Свернуть" : "Развернуть"}
        onClick={() => setIsOpen((open) => !open)}
      >
        <div className={s.titleBlock}>
          <span className={s.number}>{ticket.number}</span>
          <p className={s.subject}>{ticket.subject}</p>
        </div>
        <StatusBadge status={ticket.status} className={s.statusBadge} />
        <ChatChevronDownIcon className={cn(s.chevron, { [s.chevronOpen]: isOpen })} />
      </button>

      {isOpen && (
        <div className={s.details}>
          <div className={s.detailRow}>
            <span className={s.detailLabel}>Категория:</span>
            <span className={s.detailValue}>{CATEGORY_LABEL[ticket.category]}</span>
          </div>
          <div className={s.detailRow}>
            <span className={s.detailLabel}>Создано:</span>
            <span className={s.detailValue}>{formatWithTime(ticket.created_at)}</span>
          </div>
          <div className={s.detailRow}>
            <span className={s.detailLabel}>Последняя активность:</span>
            <span className={s.detailValue}>{formatWithTime(ticket.updated_at)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
