export type NotificationType =
  | "RESPONSE_UPDATED"
  | "RESPONSE_STATUS_CHANGED"
  | "CHAT_MESSAGE"
  | "QUESTION_ASKED"
  | "QUESTION_ANSWERED"
  | "SUPPORT_REPLY"
  | "NEW_BLOG_POST"
  | "POST_ACTIVITY"
  | "NEW_ORDER"
  | "CONTACT_ACCESS"
  | "LABOR_RESPONSE";

export type NotificationActorRole = "CUSTOMER" | "EXPERT" | "LICENSE_HOLDER";
export type NotificationResponseStatus = "REVIEW" | "REJECTED" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED";
export type NotificationReason = "DIRECT_CHANGE" | "SELECTED_ANOTHER" | "SELECTED_ANOTHER_REVERTED";

export interface ResponseUpdatedPayload {
  order_title: string;
  kind?: "CREATED" | "UPDATED" | "WITHDRAWN";
}

export interface ResponseStatusChangedPayload {
  order_title: string;
  actor_role: NotificationActorRole;
  status_from: NotificationResponseStatus;
  status_to: NotificationResponseStatus;
  reason: NotificationReason;
  rejection_reason?: string | null;
}

export interface ChatMessagePayload {
  order_title: string;
  sender_role: NotificationActorRole;
  preview: string;
}

export interface QuestionAskedPayload {
  order_title: string;
  expert_name: string;
  preview: string;
}

export interface QuestionAnsweredPayload {
  order_title: string;
  preview: string;
}

export interface SupportReplyPayload {
  ticket_number: string;
  subject: string;
  preview: string;
}

export interface NewBlogPostPayload {
  blog_title: string;
  preview: string;
}

export interface NewOrderPayload {
  order_title: string;
  badges: string[];
  message?: string;
}

export interface ContactAccessPayload {
  title: string;
  message: string;
}

export interface LaborResponsePayload {
  responder_name: string;
  listing_title: string;
}

export interface PostActivityPayload {
  kind: "like" | "comment" | "reply" | "repost" | "follow";
  actor_id: number;
  actor_name: string;
  post_id?: number;
  comment_id?: number;
}

export type NotificationPayload =
  | ResponseUpdatedPayload
  | ResponseStatusChangedPayload
  | ChatMessagePayload
  | QuestionAskedPayload
  | QuestionAnsweredPayload
  | SupportReplyPayload
  | NewBlogPostPayload
  | NewOrderPayload
  | ContactAccessPayload
  | LaborResponsePayload
  | PostActivityPayload;

export interface NotificationItem {
  id: number;
  type: NotificationType;
  payload: NotificationPayload;
  action_url: string | null;
  is_read: boolean;
  created_at: string;
  read_at: string | null;
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
