import type { Ticket, TicketCategory } from "@/entities/ticket";

/** Текстовые поля нового обращения. */
export type CreateTicketField = "subject" | "message";

/** Черновик нового обращения и состояние его отправки. */
export interface CreateTicketState {
  subject: string;
  category: TicketCategory;
  message: string;
  isSubmitting: boolean;
}

/** Изменения черновика и этапы отправки обращения. */
export type CreateTicketAction =
  | { type: "field/change"; field: CreateTicketField; value: string }
  | { type: "category/change"; category: TicketCategory }
  | { type: "submit/start" }
  | { type: "submit/success" }
  | { type: "submit/error" };

/** Действие после создания обращения: открыть его переписку. */
export interface CreateTicketOptions {
  onCreated: (ticket: Ticket) => void;
}
