"use client";

import { useEffect } from "react";
import {
  buildChatWebSocketUrl,
  markChatMessagesRead,
  type ChatMessage,
} from "@/shared/lib/chatApi";

interface UseChatWebSocketArgs {
  chatUuid: string | null;
  currentUserId: number;
  onMessage: (msg: ChatMessage) => void;
  onRead: (ids: number[]) => void;
}

export function useChatWebSocket({ chatUuid, currentUserId, onMessage, onRead }: UseChatWebSocketArgs) {
  useEffect(() => {
    if (!chatUuid || currentUserId <= 0) return;

    const wsUrl = buildChatWebSocketUrl(chatUuid);
    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let disposed = false;

    function connect() {
      if (disposed) return;
      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        void markChatMessagesRead(chatUuid!).catch(() => undefined);
      };

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data) as { event?: string; data?: unknown };
          if (payload.event === "chat_message" && payload.data) {
            const msg = payload.data as ChatMessage;
            onMessage(msg);
            if (msg.sender_id !== currentUserId) {
              void markChatMessagesRead(chatUuid!).catch(() => undefined);
            }
          } else if (payload.event === "messages_read" && payload.data) {
            const ids = (payload.data as { message_ids: number[] }).message_ids ?? [];
            onRead(ids);
          }
        } catch {
          /* ignore malformed frames */
        }
      };

      socket.onclose = () => {
        if (!disposed) reconnectTimer = setTimeout(connect, 3000);
      };

      socket.onerror = () => socket?.close();
    }

    connect();

    return () => {
      disposed = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      socket?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatUuid, currentUserId]);
}
