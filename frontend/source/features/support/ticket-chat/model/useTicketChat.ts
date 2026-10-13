"use client";

import { useEffect, useState } from "react";
import { fetchTicket, replyToTicket, useTicketFiles, type Ticket } from "@/source/entities/ticket";
import { useNotifications } from "@/source/shared/ui/Notifications";

const MAX_MESSAGE_LENGTH = 5000;

/** Переписка по обращению: загрузка, черновик ответа с файлами и отправка. Обращение после ответа отдаётся наружу — для списка. */
export function useTicketChat(ticketId: number, onReplied: (ticket: Ticket) => void) {
  const { showError } = useNotifications();
  const attachments = useTicketFiles();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchTicket(ticketId)
      .then((loaded) => {
        if (!cancelled) setTicket(loaded);
      })
      .catch((error) => {
        if (!cancelled) showError(error instanceof Error ? error.message : "Не удалось загрузить обращение");
      });
    return () => {
      cancelled = true;
    };
  }, [ticketId, showError]);

  const send = async () => {
    const text = draft.trim();
    if (!text && attachments.files.length === 0) {
      showError("Введите сообщение или прикрепите файл");
      return;
    }
    if (text.length > MAX_MESSAGE_LENGTH) {
      showError(`Сообщение не должно превышать ${MAX_MESSAGE_LENGTH} символов`);
      return;
    }
    try {
      const updated = await replyToTicket(ticketId, text, attachments.files);
      setTicket(updated);
      onReplied(updated);
      setDraft("");
      attachments.clear();
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось отправить сообщение");
    }
  };

  return { ticket, draft, attachments, setDraft, send };
}
