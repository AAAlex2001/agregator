"use client";

import { useState, type FormEvent } from "react";
import { createTicket, useTicketFiles, type Ticket, type TicketCategory } from "@/source/entities/ticket";
import { useNotifications } from "@/source/shared/ui/Notifications";

const MAX_SUBJECT_LENGTH = 200;

interface TicketFields {
  subject: string;
  category: TicketCategory;
  message: string;
}

/** Новое обращение: тема, категория, сообщение и файлы; созданное обращение отдаётся наружу. */
export function useCreateTicket(onCreated: (ticket: Ticket) => void) {
  const { showError } = useNotifications();
  const attachments = useTicketFiles();
  const [fields, setFields] = useState<TicketFields>({ subject: "", category: "ORDER", message: "" });
  const [isSending, setIsSending] = useState(false);

  const change = (next: TicketFields) => setFields({ ...next, subject: next.subject.slice(0, MAX_SUBJECT_LENGTH) });

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSending(true);
    try {
      onCreated(
        await createTicket({
          subject: fields.subject.trim(),
          category: fields.category,
          message: fields.message.trim(),
          files: attachments.files,
        }),
      );
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось создать обращение");
    } finally {
      setIsSending(false);
    }
  };

  return { fields, isSending, attachments, change, submit };
}
