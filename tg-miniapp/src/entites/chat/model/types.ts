export interface ChatAttachment {
  url: string;
  name: string;
}

export interface ChatMessage {
  id: number;
  chat_id: number;
  sender_id: number;
  sender_role: "CUSTOMER" | "EXPERT";
  text: string;
  file_url: string | null;
  file_name: string | null;
  attachments: ChatAttachment[];
  is_read: boolean;
  created_at: string;
}

export interface ChatListItem {
  id: number;
  uuid: string;
  order_id: number;
  counterpart_id: number;
  counterpart_name: string;
  counterpart_avatar_url: string | null;
  last_message_text: string;
  last_message_sender_id: number | null;
  last_message_at: string | null;
  unread_count: number;
  updated_at: string;
}

export interface ChatList {
  items: ChatListItem[];
  total: number;
}

export interface ChatBadge {
  text: string;
  variant: string;
}

export interface ChatDetail {
  id: number;
  uuid: string;
  order_id: number;
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
  response_status: string | null;
  is_blocked: boolean;
  is_manually_blocked: boolean;
  messages: ChatMessage[];
}
