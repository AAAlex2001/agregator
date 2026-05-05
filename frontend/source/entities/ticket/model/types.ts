export type TicketStatus = "REVIEW" | "ANSWERED" | "CLOSED";

export type TicketCategory =
  | "ORDER"
  | "RESPONSE"
  | "TECHNICAL"
  | "BILLING"
  | "ACCOUNT"
  | "COMPLAINT"
  | "SUGGESTION"
  | "OTHER";

export interface TicketAttachment {
  name: string;
  url: string;
}

export interface TicketMessage {
  id: number;
  author: "user" | "support";
  authorName: string;
  text: string;
  createdAt: string;
  attachments?: TicketAttachment[];
}

export interface SupportTicket {
  id: number;
  number: string;
  subject: string;
  category: TicketCategory;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  hasUnread: boolean;
  lastMessagePreview: string;
  messages: TicketMessage[];
}

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
