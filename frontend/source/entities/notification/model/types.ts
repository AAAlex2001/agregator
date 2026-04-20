export type NotificationType = "RESPONSE_UPDATED" | "RESPONSE_STATUS_CHANGED" | "CHAT_MESSAGE";
export type NotificationActorRole = "CUSTOMER" | "EXPERT";
export type NotificationResponseStatus = "REVIEW" | "REJECTED" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED";
export type NotificationReason = "DIRECT_CHANGE" | "SELECTED_ANOTHER";
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
}

export interface ChatMessageNotificationPayload {
  order_title: string;
  sender_role: NotificationActorRole;
  preview: string;
}

export type NotificationPayload =
  | ResponseUpdatedNotificationPayload
  | ResponseStatusChangedNotificationPayload
  | ChatMessageNotificationPayload
  | Record<string, unknown>;

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
  total: number;
  unread_count: number;
}

export interface NotificationMutationResponse {
  unread_count: number;
  updated: number;
  item: NotificationItem | null;
}