export type NotificationType = "RESPONSE_UPDATED" | "RESPONSE_STATUS_CHANGED" | "CHAT_MESSAGE" | "QUESTION_ASKED" | "QUESTION_ANSWERED" | "SUPPORT_REPLY" | "NEW_BLOG_POST" | "NEW_ORDER" | "CONTACT_ACCESS" | "LABOR_RESPONSE";
export type NotificationActorRole = "CUSTOMER" | "EXPERT" | "LICENSE_HOLDER";
export type NotificationResponseStatus = "REVIEW" | "REJECTED" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED";
export type NotificationReason = "DIRECT_CHANGE" | "SELECTED_ANOTHER" | "SELECTED_ANOTHER_REVERTED";
export type ResponseUpdateKind = "CREATED" | "UPDATED" | "WITHDRAWN";

export interface ResponseUpdatedNotificationPayload {
  order_title: string;
  kind?: ResponseUpdateKind;
}

export interface ResponseStatusChangedNotificationPayload {
  order_title: string;
  actor_role: NotificationActorRole;
  status_from: NotificationResponseStatus;
  status_to: NotificationResponseStatus;
  reason: NotificationReason;
  rejection_reason?: string | null;
}

export interface ChatMessageNotificationPayload {
  order_title: string;
  sender_role: NotificationActorRole;
  preview: string;
}

export interface QuestionAskedNotificationPayload {
  order_title: string;
  expert_name: string;
  preview: string;
}

export interface QuestionAnsweredNotificationPayload {
  order_title: string;
  preview: string;
}

export interface SupportReplyNotificationPayload {
  ticket_number: string;
  subject: string;
  preview: string;
}

export interface NewBlogPostNotificationPayload {
  blog_title: string;
  preview: string;
}

export interface NewOrderNotificationPayload {
  order_title: string;
  badges: string[];
  message?: string;
}

export interface ContactAccessNotificationPayload {
  title: string;
  message: string;
}

export interface LaborResponseNotificationPayload {
  responder_name: string;
  listing_title: string;
}

export type NotificationPayload =
  | ResponseUpdatedNotificationPayload
  | ResponseStatusChangedNotificationPayload
  | ChatMessageNotificationPayload
  | QuestionAskedNotificationPayload
  | QuestionAnsweredNotificationPayload
  | SupportReplyNotificationPayload
  | NewBlogPostNotificationPayload
  | NewOrderNotificationPayload
  | ContactAccessNotificationPayload
  | LaborResponseNotificationPayload;

export interface NotificationItem {
  id: number;
  type: NotificationType;
  payload: NotificationPayload;
  action_url: string | null;
  is_read: boolean;
  created_at: string;
  read_at: string | null;
}

export interface NotificationCardModel {
  id: number;
  title: string;
  message: string;
  actionLabel: string | null;
  actionUrl: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationListResponse {
  items: NotificationItem[];
  has_more: boolean;
  unread_count: number;
}

export interface NotificationMutationResponse {
  unread_count: number;
  updated: number;
  item: NotificationItem | null;
}
