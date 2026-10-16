import type { TicketCategory } from "../model/types";

/** Темы обращений в порядке выбора в форме. */
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

/** Подписи тем обращений. */
export const TICKET_CATEGORY_LABELS = {
  ORDER: "Вопрос по заказу",
  RESPONSE: "Вопрос по отклику",
  TECHNICAL: "Технический",
  BILLING: "Оплата и подписка",
  ACCOUNT: "Аккаунт",
  COMPLAINT: "Жалоба",
  SUGGESTION: "Предложение",
  OTHER: "Другое",
};

/** Подписи состояний обращения. */
export const TICKET_STATUS_LABELS = {
  REVIEW: "На рассмотрении",
  ANSWERED: "Получен ответ",
  CLOSED: "Закрыт",
};
