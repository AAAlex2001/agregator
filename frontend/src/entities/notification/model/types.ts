/** Роль участника, действие которого вызвало уведомление. */
export type NotificationActorRole = "CUSTOMER" | "EXPERT" | "LICENSE_HOLDER";

/** Статус отклика в уведомлении о его смене. */
export type NotificationResponseStatus =
  | "REVIEW"
  | "REJECTED"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "WITHDRAWN_BY_EXPERT";

/** Данные уведомления о новом, изменённом или отозванном отклике. */
export interface ResponseUpdatedPayload {
  order_title: string;
  kind: "CREATED" | "UPDATED" | "WITHDRAWN";
}

/** Данные уведомления о смене статуса отклика. */
export interface ResponseStatusChangedPayload {
  order_title: string;
  actor_role: NotificationActorRole;
  status_from: NotificationResponseStatus;
  status_to: NotificationResponseStatus;
  reason: "DIRECT_CHANGE" | "SELECTED_ANOTHER" | "SELECTED_ANOTHER_REVERTED";
  rejection_reason: string | null;
}

/** Данные уведомления о новом сообщении в чате заказа. */
export interface ChatMessagePayload {
  order_title: string;
  sender_role: NotificationActorRole;
  preview: string;
}

/** Данные уведомления о вопросе исполнителя по заказу. */
export interface QuestionAskedPayload {
  order_title: string;
  expert_name: string;
  preview: string;
}

/** Данные уведомления об ответе заказчика на вопрос. */
export interface QuestionAnsweredPayload {
  order_title: string;
  preview: string;
}

/** Данные уведомления об ответе поддержки. */
export interface SupportReplyPayload {
  ticket_number: string;
  subject: string;
  preview: string;
}

/** Данные уведомления о новой статье блога. */
export interface NewBlogPostPayload {
  blog_title: string;
  preview: string;
}

/** Данные уведомления о новой заявке по типам исполнителя. */
export interface NewOrderPayload {
  order_title: string;
  badges: string[];
  message: string;
}

/** Данные уведомления по сделке доступа к контактам. */
export interface ContactAccessPayload {
  title: string;
  message: string;
}

/** Данные уведомления об отклике на объявление трудовых ресурсов. */
export interface LaborResponsePayload {
  responder_name: string;
  listing_title: string;
}

/** Данные уведомления о реакции на публикацию или новой подписке. */
export interface PostActivityPayload {
  kind: "like" | "comment" | "reply" | "repost" | "follow";
  actor_id: number;
  actor_name: string;
  post_id: number | null;
  comment_id: number | null;
}

/** Общие поля любого уведомления. */
interface NotificationBase {
  id: number;
  action_url: string | null;
  is_read: boolean;
  created_at: string;
  read_at: string | null;
}

/** Уведомление: тип определяет набор данных в payload. */
export type NotificationItem = NotificationBase & (
  | { type: "RESPONSE_UPDATED"; payload: ResponseUpdatedPayload }
  | { type: "RESPONSE_STATUS_CHANGED"; payload: ResponseStatusChangedPayload }
  | { type: "CHAT_MESSAGE"; payload: ChatMessagePayload }
  | { type: "QUESTION_ASKED"; payload: QuestionAskedPayload }
  | { type: "QUESTION_ANSWERED"; payload: QuestionAnsweredPayload }
  | { type: "SUPPORT_REPLY"; payload: SupportReplyPayload }
  | { type: "NEW_BLOG_POST"; payload: NewBlogPostPayload }
  | { type: "NEW_ORDER"; payload: NewOrderPayload }
  | { type: "CONTACT_ACCESS"; payload: ContactAccessPayload }
  | { type: "LABOR_RESPONSE"; payload: LaborResponsePayload }
  | { type: "POST_ACTIVITY"; payload: PostActivityPayload }
);

/** Страница уведомлений, признак следующей страницы и число непрочитанных. */
export interface NotificationPage {
  items: NotificationItem[];
  has_more: boolean;
  unread_count: number;
}

/** Ответ на отметку или удаление: новый счётчик и изменённое уведомление. */
export interface NotificationChange {
  unread_count: number;
  updated: number;
  item: NotificationItem | null;
}

/** Заголовок, текст и подпись кнопки карточки уведомления. */
export interface NotificationText {
  title: string;
  message: string;
  actionLabel: string;
}
