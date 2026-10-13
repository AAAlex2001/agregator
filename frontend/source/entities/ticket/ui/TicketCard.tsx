"use client";

import cn from "classnames";
import { formatRelative } from "@/source/shared/lib/formatDate";
import { CATEGORY_LABEL, type TicketSummary } from "../model/types";
import { StatusBadge } from "./StatusBadge";
import s from "./TicketCard.module.scss";

interface TicketCardProps {
  ticket: TicketSummary;
  isActive: boolean;
  onClick: () => void;
}

/** Обращение в списке: номер, статус, тема, последнее сообщение, категория и дата. */
export function TicketCard({ ticket, isActive, onClick }: TicketCardProps) {
  return (
    <button
      type="button"
      className={cn(s.card, { [s.active]: isActive })}
      onClick={onClick}
      aria-current={isActive ? "true" : undefined}
    >
      <div className={s.topRow}>
        <span className={s.number}>{ticket.number}</span>
        <StatusBadge status={ticket.status} />
      </div>

      <span className={s.subject}>{ticket.subject}</span>

      {ticket.last_message_preview && (
        <p className={cn(s.preview, { [s.previewUnread]: ticket.has_unread })}>{ticket.last_message_preview}</p>
      )}

      <div className={s.bottomRow}>
        <span className={s.category}>{CATEGORY_LABEL[ticket.category]}</span>
        <span className={s.date}>{formatRelative(ticket.updated_at)}</span>
      </div>
    </button>
  );
}
