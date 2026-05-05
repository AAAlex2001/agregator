"use client";

import { useState } from "react";
import { ChatChevronDownIcon } from "@/source/shared/ui/icons";
import {
  CATEGORY_LABEL,
  type SupportTicket,
} from "../model/types";
import { StatusBadge } from "./StatusBadge";
import s from "./TicketHeader.module.scss";

interface Props {
  ticket: SupportTicket;
}

function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function TicketHeader({ ticket }: Props) {
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
        <div className={s.titleBlock}>
          <span className={s.number}>{ticket.number}</span>
          <p className={s.subject}>{ticket.subject}</p>
        </div>
        <StatusBadge status={ticket.status} className={s.statusBadge} />
        <ChatChevronDownIcon
          className={`${s.chevron} ${open ? s.chevronOpen : ""}`.trim()}
        />
      </button>

      {open && (
        <div className={s.details}>
          <div className={s.detailRow}>
            <span className={s.detailLabel}>Категория:</span>
            <span className={s.detailValue}>{CATEGORY_LABEL[ticket.category]}</span>
          </div>
          <div className={s.detailRow}>
            <span className={s.detailLabel}>Создано:</span>
            <span className={s.detailValue}>{formatDateTime(ticket.createdAt)}</span>
          </div>
          <div className={s.detailRow}>
            <span className={s.detailLabel}>Последняя активность:</span>
            <span className={s.detailValue}>{formatDateTime(ticket.updatedAt)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
