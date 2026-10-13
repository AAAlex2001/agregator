"use client";

import { useEffect, useRef } from "react";
import { MessageBubble, TICKET_FILE_ACCEPT, TicketHeader, type Ticket } from "@/source/entities/ticket";
import { FileGallery } from "@/source/shared/ui/FileGallery";
import { ArrowIcon, ChatClipIcon } from "@/source/shared/ui/icons";
import { MessageComposer } from "@/source/shared/ui/MessageComposer";
import { useTicketChat } from "../model/useTicketChat";
import { TicketChatSkeleton } from "./TicketChatSkeleton";
import s from "./TicketChat.module.scss";

interface TicketChatProps {
  ticketId: number;
  onBack: () => void;
  onReplied: (ticket: Ticket) => void;
}

/** Переписка по обращению и поле ответа с файлами; в закрытом обращении отвечать нельзя. */
export function TicketChat({ ticketId, onBack, onReplied }: TicketChatProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const { ticket, draft, attachments, setDraft, send } = useTicketChat(ticketId, onReplied);
  const messageCount = ticket?.messages.length ?? 0;

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight });
  }, [messageCount]);

  if (!ticket) return <TicketChatSkeleton />;

  const isClosed = ticket.status === "CLOSED";

  return (
    <div className={s.card}>
      <div className={s.headerRow}>
        <button type="button" className={s.backBtn} aria-label="Назад" onClick={onBack}>
          <ArrowIcon color="currentColor" />
        </button>
        <TicketHeader ticket={ticket} />
      </div>

      <div className={s.thread} ref={threadRef} role="log" aria-live="polite">
        {ticket.messages.map((message, index) => (
          <MessageBubble key={message.id} message={message} showHead={index === 0 || ticket.messages[index - 1].author !== message.author} />
        ))}
      </div>

      <MessageComposer
        value={draft}
        onChange={setDraft}
        onSend={send}
        multiline
        disabled={isClosed}
        disabledText="Обращение закрыто. Если вопрос остался — создайте новое."
        canSend={draft.trim().length > 0 || attachments.files.length > 0}
        extras={
          !isClosed && attachments.items.length > 0 ? (
            <FileGallery items={attachments.items} hideWhenEmpty variant="editable" blockClassName={s.pendingFiles} />
          ) : null
        }
        affix={
          !isClosed ? (
            <>
              <button
                type="button"
                className={s.clip}
                aria-label="Прикрепить файл"
                disabled={attachments.isFull}
                onClick={() => fileInputRef.current?.click()}
              >
                <ChatClipIcon />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept={TICKET_FILE_ACCEPT}
                multiple
                hidden
                onChange={(event) => {
                  attachments.add(event.currentTarget.files);
                  event.currentTarget.value = "";
                }}
              />
            </>
          ) : null
        }
      />
    </div>
  );
}
