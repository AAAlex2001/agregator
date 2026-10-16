"use client";

import cn from "classnames";
import { useState } from "react";
import { formatWithTime } from "@/shared/lib/format-date";
import { ChatChevronDownIcon } from "@/shared/ui/icons";
import { TICKET_CATEGORY_LABELS } from "../../config/labels";
import type { TicketSummary } from "../../model/types";
import { TicketStatusBadge } from "../ticket-status-badge";
import styles from "./style.module.scss";

/** Открытое обращение. */
interface TicketHeaderProps {
  ticket: TicketSummary;
}

/** Шапка переписки: номер, тема и статус; по клику раскрываются категория и даты. */
export function TicketHeader({ ticket }: TicketHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.banner}>
      <button
        type="button"
        className={styles.titleRow}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Свернуть" : "Развернуть"}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles.titleBlock}>
          <span className={styles.number}>{ticket.number}</span>
          <p className={styles.subject}>{ticket.subject}</p>
        </div>
        <TicketStatusBadge
          status={ticket.status}
          className={styles.statusBadge}
        />
        <ChatChevronDownIcon
          className={cn(styles.chevron, {
            [styles.chevronOpen]: isOpen,
          })}
        />
      </button>

      {isOpen && (
        <div className={styles.details}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Категория:</span>
            <span className={styles.detailValue}>
              {TICKET_CATEGORY_LABELS[ticket.category]}
            </span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Создано:</span>
            <span className={styles.detailValue}>{formatWithTime(ticket.created_at)}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Последняя активность:</span>
            <span className={styles.detailValue}>{formatWithTime(ticket.updated_at)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
