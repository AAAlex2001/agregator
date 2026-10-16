/** Файл, приложенный к сообщению. */
export interface ExpertRoomAttachment {
  url: string;
  name: string;
}

/** Сообщение общего чата исполнителей с именем и фото отправителя. */
export interface ExpertRoomMessage {
  id: number;
  sender_id: number;
  sender_name: string;
  sender_avatar_url: string | null;
  text: string;
  attachments: ExpertRoomAttachment[];
  created_at: string;
}

/** Страница истории и блокировка текущего пользователя в чате. */
export interface ExpertRoomHistory {
  items: ExpertRoomMessage[];
  has_more: boolean;
  banned: boolean;
  ban_reason: string | null;
}

/** Подряд идущие сообщения одного отправителя. */
export interface ExpertRoomMessageGroup {
  senderId: number;
  senderName: string;
  senderAvatarUrl: string | null;
  messages: ExpertRoomMessage[];
}

/** Коллега, который сейчас набирает сообщение. */
export interface ExpertRoomTypingUser {
  user_id: number;
  user_name: string;
}

/** Коллега, набирающий текст, и момент, когда подпись нужно убрать. */
export interface ExpertRoomTypingEntry extends ExpertRoomTypingUser {
  expiresAt: number;
}

/** Состояние истории чата и блокировка текущего пользователя. */
export interface ExpertRoomHistoryState {
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  isBanned: boolean;
  banReason: string | null;
}

/** Открытое подключение к чату: отправка сигнала набора текста и отключение. */
export interface ExpertRoomSocket {
  sendTyping: () => void;
  disconnect: () => void;
}

/** Событие WebSocket чата: новое сообщение или сигнал набора текста. */
export type ExpertRoomSocketEvent =
  | { event: "expert_room_message"; data: ExpertRoomMessage }
  | { event: "expert_room_typing"; data: ExpertRoomTypingUser };
