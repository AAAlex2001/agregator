"use client";

import { formatRelative } from "@/source/shared/lib/formatDate";
import { CATEGORY_LABEL, type SupportTicket } from "../model/types";
import { StatusBadge } from "./StatusBadge";
import s from "./TicketCard.module.scss";

interface Props {
  ticket: SupportTicket;
  isActive: boolean;
  onClick: () => void;
}

export function TicketCard({ ticket, isActive, onClick }: Props) {
  const preview =
    ticket.lastMessagePreview ||
    ticket.messages[ticket.messages.length - 1]?.text ||
    "";
  const previewClass = `${s.preview} ${ticket.hasUnread ? s.previewUnread : ""}`.trim();

  return (
    <button
      type="button"
      className={`${s.card} ${isActive ? s.active : ""}`}
      onClick={onClick}
    >
      <div className={s.topRow}>
        <span className={s.number}>{ticket.number}</span>
        <StatusBadge status={ticket.status} />
      </div>

      <span className={s.subject}>{ticket.subject}</span>

      {preview && <p className={previewClass}>{preview}</p>}

      <div className={s.bottomRow}>
        <span className={s.category}>{CATEGORY_LABEL[ticket.category]}</span>
        <span className={s.date}>{formatRelative(ticket.updatedAt)}</span>
      </div>
    </button>
  );
}
