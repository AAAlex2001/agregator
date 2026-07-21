export interface ChatBadge {
  text: string;
  variant: string;
}

export interface ChatAttachmentData {
  url: string;
  name: string;
}

export interface ChatListItemData {
  id: number;
  uuid: string;
  order_id: number | null;
  counterpart_id: number;
  counterpart_name: string;
  counterpart_avatar_url: string | null;
  last_message_text: string;
  last_message_sender_id: number | null;
  last_message_at: string | null;
  unread_count: number;
  updated_at: string;
}

export interface ChatMessageData {
  id: number;
  chat_id: number;
  sender_id: number;
  sender_role: "CUSTOMER" | "EXPERT";
  text: string;
  file_url: string | null;
  file_name: string | null;
  attachments: ChatAttachmentData[];
  is_read: boolean;
  created_at: string;
}

export type ChatResponseStatus = "REVIEW" | "REJECTED" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED";

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
