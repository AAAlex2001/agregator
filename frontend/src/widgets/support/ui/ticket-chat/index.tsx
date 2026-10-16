"use client";

import { useEffect, useRef } from "react";
import { TicketHeader, TicketMessage, useTicket } from "@/entities/ticket";
import type { Ticket } from "@/entities/ticket";
import { TicketReplyForm } from "@/features/reply-to-ticket";
import { EmptyState } from "@/shared/ui/empty-state";
import { ArrowIcon } from "@/shared/ui/icons";
import { TicketChatSkeleton } from "../ticket-chat-skeleton";
import styles from "./style.module.scss";

/** Открытое обращение, возврат к списку и передача обращения после ответа. */
interface TicketChatProps {
  ticketId: number;
  onBack: () => void;
  onReplied: (ticket: Ticket) => void;
}

/** Переписка по обращению и поле ответа; новые сообщения прокручиваются вниз. */
export function TicketChat({ ticketId, onBack, onReplied }: TicketChatProps) {
  const threadRef = useRef<HTMLDivElement>(null);
  const { ticket, error, applyTicket } = useTicket(ticketId);
  const messageCount = ticket?.messages.length ?? 0;

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight });
  }, [messageCount]);

  /** Показывает ответ в переписке и обновляет обращение в списке. */
  function applyReply(updated: Ticket) {
    applyTicket(updated);
    onReplied(updated);
  }

  if (error) {
    return (
      <EmptyState
        title="Не удалось загрузить обращение"
        subtitle={error}
        actionLabel="К списку"
        onAction={onBack}
      />
    );
  }

  if (!ticket) {
    return <TicketChatSkeleton />;
  }

  return (
    <div className={styles.card}>
      <div className={styles.headerRow}>
        <button
          type="button"
          className={styles.backButton}
          aria-label="Назад"
          onClick={onBack}
        >
          <ArrowIcon />
        </button>
        <TicketHeader ticket={ticket} />
      </div>

      <div
        ref={threadRef}
        className={styles.thread}
        role="log"
        aria-live="polite"
      >
        {ticket.messages.map((message, index) => (
          <TicketMessage
            key={message.id}
            message={message}
            showHead={ticket.messages[index - 1]?.author !== message.author}
          />
        ))}
      </div>

      <TicketReplyForm
        ticket={ticket}
        onReplied={applyReply}
      />
    </div>
  );
}
