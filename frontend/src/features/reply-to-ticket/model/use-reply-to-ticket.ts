"use client";

import { useState } from "react";
import { replyToTicket, useTicketFiles } from "@/entities/ticket";
import { useNotifications } from "@/shared/ui/notifications";
import type { ReplyToTicketOptions } from "./types";

/** Наибольшая длина ответа в обращении. */
const MESSAGE_MAX_LENGTH = 5000;

/** Черновик ответа с файлами; обращение после ответа отдаётся наружу. */
export function useReplyToTicket({ ticketId, onReplied }: ReplyToTicketOptions) {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const attachments = useTicketFiles();
  const { showError } = useNotifications();
  const canSend = text.trim().length > 0 || attachments.files.length > 0;

  /** Отправляет текст и файлы; при ошибке оставляет черновик для повтора. */
  async function send() {
    const message = text.trim();

    if (isSending) {
      return;
    }

    if (!canSend) {
      showError("Введите сообщение или прикрепите файл");
      return;
    }

    if (message.length > MESSAGE_MAX_LENGTH) {
      showError(`Сообщение не должно превышать ${MESSAGE_MAX_LENGTH} символов`);
      return;
    }

    setIsSending(true);

    try {
      const ticket = await replyToTicket(ticketId, message, attachments.files);

      onReplied(ticket);
      setText("");
      attachments.clearFiles();
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось отправить сообщение");
    } finally {
      setIsSending(false);
    }
  }

  return {
    text,
    isSending,
    canSend,
    attachments,
    setText,
    send,
  };
}
