/** Состояние обращения в поддержку. */
export type TicketStatus = "REVIEW" | "ANSWERED" | "CLOSED";

/** Тема обращения, которую пользователь выбирает при создании. */
export type TicketCategory =
  | "ORDER"
  | "RESPONSE"
  | "TECHNICAL"
  | "BILLING"
  | "ACCOUNT"
  | "COMPLAINT"
  | "SUGGESTION"
  | "OTHER";

/** Файл, приложенный к сообщению переписки. */
export interface TicketAttachment {
  name: string;
  url: string;
}

/** Сообщение пользователя или поддержки в обращении. */
export interface TicketMessage {
  id: number;
  author: "user" | "support";
  author_name: string;
  text: string;
  created_at: string;
  attachments: TicketAttachment[];
}

/** Обращение в списке: без переписки, с превью последнего сообщения. */
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

/** Обращение вместе с перепиской. */
export interface Ticket extends TicketSummary {
  messages: TicketMessage[];
}

/** Страница списка обращений. */
export interface TicketList {
  items: TicketSummary[];
  has_more: boolean;
}

/** Поля нового обращения с первым сообщением и файлами. */
export interface NewTicket {
  subject: string;
  category: TicketCategory;
  message: string;
  files: File[];
}

/** Загруженные обращения и состояние первой и следующих страниц. */
export interface TicketListState {
  tickets: TicketSummary[];
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
}

/** Ответы на загрузку страниц и изменения обращений из переписки. */
export type TicketListAction =
  | { type: "load/success"; tickets: TicketSummary[]; hasMore: boolean }
  | { type: "load/error"; error: string }
  | { type: "more/start" }
  | { type: "more/success"; tickets: TicketSummary[]; hasMore: boolean }
  | { type: "more/error" }
  | { type: "ticket/read"; id: number }
  | { type: "ticket/upsert"; ticket: Ticket };
