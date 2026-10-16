import type { Ticket } from "@/entities/ticket";

/** Обращение для ответа и действие с его обновлённой версией. */
export interface ReplyToTicketOptions {
  ticketId: number;
  onReplied: (ticket: Ticket) => void;
}
