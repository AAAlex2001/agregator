export type TicketStatus = "REVIEW" | "ANSWERED" | "CLOSED";

export type TicketCategory = "ORDER" | "RESPONSE" | "TECHNICAL" | "BILLING" | "ACCOUNT" | "COMPLAINT" | "SUGGESTION" | "OTHER";

export interface TicketAttachment {
  name: string;
  url: string;
}

export interface TicketMessage {
  id: number;
  author: "user" | "support";
  author_name: string;
  text: string;
  created_at: string;
  attachments: TicketAttachment[];
}

export interface TicketSummary {
  id: number;
  number: string;
  subject: string;
  category: TicketCategory;
  status: TicketStatus;
  created_at: string;
  updated_at: string;
  has_unread: boolean;
  last_message_preview: string;
}

export interface Ticket extends TicketSummary {
  messages: TicketMessage[];
}

export interface TicketList {
  items: TicketSummary[];
  has_more: boolean;
}

export interface NewTicket {
  subject: string;
  category: TicketCategory;
  message: string;
  files: File[];
}

export const TICKET_CATEGORIES: TicketCategory[] = [
  "ORDER",
  "RESPONSE",
  "TECHNICAL",
  "BILLING",
  "ACCOUNT",
  "COMPLAINT",
  "SUGGESTION",
  "OTHER",
];

export const CATEGORY_LABEL: Record<TicketCategory, string> = {
  ORDER: "Вопрос по заказу",
  RESPONSE: "Вопрос по отклику",
  TECHNICAL: "Технический",
  BILLING: "Оплата и подписка",
  ACCOUNT: "Аккаунт",
  COMPLAINT: "Жалоба",
  SUGGESTION: "Предложение",
  OTHER: "Другое",
};

export const STATUS_LABEL: Record<TicketStatus, string> = {
  REVIEW: "На рассмотрении",
  ANSWERED: "Получен ответ",
  CLOSED: "Закрыт",
};
