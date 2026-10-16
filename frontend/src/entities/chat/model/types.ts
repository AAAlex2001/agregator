/** Вид объявления трудовых ресурсов, к которому относится чат. */
export type ChatLaborListingKind = "EXPERT_WANTED" | "EXPERT_AVAILABLE";

/** Диалог в списке чатов: собеседник, последнее сообщение и непрочитанные. */
export interface ChatListItemData {
  id: number;
  uuid: string;
  order_id: number | null;
  labor_listing_id: number | null;
  labor_listing_kind: ChatLaborListingKind | null;
  labor_listing_is_mine: boolean | null;
  contact_deal_id: number | null;
  counterpart_id: number;
  counterpart_name: string;
  counterpart_avatar_url: string | null;
  last_message_text: string;
  last_message_sender_id: number | null;
  last_message_at: string | null;
  unread_count: number;
  is_blocked: boolean;
  updated_at: string;
}

/** Непрочитанные сообщения в разделах шапки кабинета. */
export interface ChatUnreadCounts {
  labor: number;
  deals: number;
  expertSearch: number;
  employment: number;
}

/** Роль автора сообщения в переписке. */
export type ChatParticipantRole = "CUSTOMER" | "EXPERT" | "LICENSE_HOLDER";

/** Файл, приложенный к сообщению. */
export interface ChatAttachment {
  url: string;
  name: string;
}

/** Сообщение переписки; file_url и file_name остались у старых сообщений с одним файлом. */
export interface ChatMessageData {
  id: number;
  chat_id: number;
  sender_id: number;
  sender_role: ChatParticipantRole;
  text: string;
  file_url: string | null;
  file_name: string | null;
  attachments: ChatAttachment[];
  is_read: boolean;
  created_at: string;
}

/** Подряд идущие сообщения одного отправителя. */
export interface ChatMessageGroup {
  senderId: number;
  senderRole: ChatParticipantRole;
  messages: ChatMessageData[];
}

/** Требование заказа к исполнителю и цвет его плашки. */
export interface ChatBadge {
  text: string;
  variant: string;
}

/** Статус отклика, по которому открыт чат заказа. */
export type ChatResponseStatus =
  | "REVIEW"
  | "REJECTED"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "COMPLETED";

/** Открытая переписка: заказ, собеседник, блокировка и последние сообщения. */
export interface ChatDetailData {
  id: number;
  uuid: string;
  order_id: number | null;
  order_public_id: string;
  customer_id: number;
  expert_id: number;
  order_title: string;
  order_company: string;
  order_date: string;
  order_sum: string;
  order_badges: ChatBadge[];
  counterpart_id: number;
  counterpart_name: string;
  counterpart_avatar_url: string | null;
  response_status: ChatResponseStatus | null;
  is_blocked: boolean;
  is_manually_blocked: boolean;
  messages: ChatMessageData[];
}

/** Текст, файлы и ключ повтора отправляемого сообщения. */
export interface ChatMessageDraft {
  text: string;
  files: File[];
  clientMessageId: string;
}

/** Событие WebSocket переписки: новое сообщение, прочтение или присутствие. */
export type ChatSocketEvent =
  | { event: "chat_message"; data: ChatMessageData }
  | { event: "messages_read"; data: { message_ids: number[] } }
  | { event: "chat_presence"; data: { online_user_ids: number[] } };
