"use client";

import { CATEGORY_LABEL, type SupportTicket } from "../model/types";
import { StatusBadge } from "./StatusBadge";
import s from "./TicketCard.module.scss";

interface Props {
  ticket: SupportTicket;
  isActive: boolean;
  onClick: () => void;
}

function formatRelative(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const today = new Date();
  const sameDay =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();
  if (sameDay) {
    return date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

export function TicketCard({ ticket, isActive, onClick }: Props) {
  const last = ticket.messages[ticket.messages.length - 1];
  const preview = last?.text ?? "";

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

      <p className={s.preview}>{preview}</p>

      <div className={s.bottomRow}>
        <span className={s.category}>{CATEGORY_LABEL[ticket.category]}</span>
        <span className={s.date}>{formatRelative(ticket.updatedAt)}</span>
      </div>
    </button>
  );
}
