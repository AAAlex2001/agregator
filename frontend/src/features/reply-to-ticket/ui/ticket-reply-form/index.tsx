"use client";

import { useRef } from "react";
import type { KeyboardEvent } from "react";
import { TICKET_FILE_ACCEPT } from "@/entities/ticket";
import type { Ticket } from "@/entities/ticket";
import { FileGallery } from "@/shared/ui/file-gallery";
import { ChatClipIcon, ChatSendIcon } from "@/shared/ui/icons";
import { Loader } from "@/shared/ui/loader";
import { useReplyToTicket } from "../../model/use-reply-to-ticket";
import styles from "./style.module.scss";

/** Открытое обращение и действие с его версией после ответа. */
interface TicketReplyFormProps {
  ticket: Ticket;
  onReplied: (ticket: Ticket) => void;
}

/** Поле ответа с файлами; в закрытом обращении вместо поля — пояснение. */
export function TicketReplyForm({ ticket, onReplied }: TicketReplyFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { text, isSending, canSend, attachments, setText, send } = useReplyToTicket({
    ticketId: ticket.id,
    onReplied,
  });

  /** Отправляет ответ по Enter, перенос строки — Shift+Enter. */
  function sendOnEnter(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void send();
    }
  }

  if (ticket.status === "CLOSED") {
    return (
      <div className={styles.wrap}>
        <div className={styles.blockedBar}>
          <p className={styles.blockedText}>
            Обращение закрыто. Если вопрос остался — создайте новое.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      {attachments.items.length > 0 && (
        <FileGallery
          items={attachments.items}
          hideWhenEmpty
          variant="editable"
          blockClassName={styles.pendingFiles}
        />
      )}

      <div className={styles.bar}>
        <div className={styles.inputWrap}>
          <textarea
            className={styles.input}
            placeholder="Сообщение..."
            rows={1}
            value={text}
            disabled={isSending}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={sendOnEnter}
          />
          <button
            type="button"
            className={styles.clip}
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
              attachments.addFiles(event.currentTarget.files);
              event.currentTarget.value = "";
            }}
          />
        </div>

        <button
          type="button"
          className={styles.send}
          aria-label="Отправить"
          disabled={!canSend || isSending}
          onClick={send}
        >
          {isSending ? (
            <Loader
              size="sm"
              label=""
            />
          ) : (
            <ChatSendIcon />
          )}
        </button>
      </div>
    </div>
  );
}
