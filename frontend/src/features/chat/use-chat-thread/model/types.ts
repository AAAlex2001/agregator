import type { ChatMessage } from "@/shared/lib/chatApi";

export interface UseChatWebSocketArgs {
  chatUuid: string | null;
  currentUserId: number;
  onMessage: (msg: ChatMessage) => void;
  onRead: (ids: number[]) => void;
}
