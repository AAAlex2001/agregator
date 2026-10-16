import cn from "classnames";
import { formatRelative } from "@/shared/lib/format-date";
import { TICKET_CATEGORY_LABELS } from "../../config/labels";
import type { TicketSummary } from "../../model/types";
import { TicketStatusBadge } from "../ticket-status-badge";
import styles from "./style.module.scss";

/** Обращение в списке, выделение открытого и действие выбора. */
interface TicketCardProps {
  ticket: TicketSummary;
  isActive: boolean;
  onSelect: (id: number) => void;
}

/** Обращение в списке: номер, статус, тема, последнее сообщение, категория и дата. */
export function TicketCard({ ticket, isActive, onSelect }: TicketCardProps) {
  /** Открывает переписку этого обращения. */
  function selectTicket() {
    onSelect(ticket.id);
  }

  return (
    <button
      type="button"
      className={cn(styles.card, {
        [styles.active]: isActive,
      })}
      aria-current={isActive ? "true" : undefined}
      onClick={selectTicket}
    >
      <div className={styles.topRow}>
        <span className={styles.number}>{ticket.number}</span>
        <TicketStatusBadge status={ticket.status} />
      </div>

      <span className={styles.subject}>{ticket.subject}</span>

      {ticket.last_message_preview && (
        <p
          className={cn(styles.preview, {
            [styles.previewUnread]: ticket.has_unread,
          })}
        >
          {ticket.last_message_preview}
        </p>
      )}

      <div className={styles.bottomRow}>
        <span className={styles.category}>
          {TICKET_CATEGORY_LABELS[ticket.category]}
        </span>
        <span className={styles.date}>{formatRelative(ticket.updated_at)}</span>
      </div>
    </button>
  );
}
