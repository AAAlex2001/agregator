export interface ExpertRoomAttachment {
  url: string;
  name: string;
}

export interface ExpertRoomMessageData {
  id: number;
  sender_id: number;
  sender_name: string;
  sender_avatar_url: string | null;
  text: string;
  attachments: ExpertRoomAttachment[];
  created_at: string;
}

export interface ExpertRoomHistoryResponse {
  items: ExpertRoomMessageData[];
  has_more: boolean;
  banned: boolean;
  ban_reason: string | null;
}

export interface ExpertRoomTypingPayload {
  user_id: number;
  user_name: string;
}

export interface ExpertRoomMessageGroup {
  senderId: number;
  senderName: string;
  senderAvatarUrl: string | null;
  messages: ExpertRoomMessageData[];
}
