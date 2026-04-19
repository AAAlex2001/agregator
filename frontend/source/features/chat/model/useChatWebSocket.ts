"use client";

import { useEffect, useRef } from "react";
import { buildChatWebSocketUrl, markChatMessagesRead } from "../api/chat.api";
import type { ChatMessageData } from "@/source/entities/chat";

interface UseChatWebSocketArgs {
  chatUuid: string | null;
  currentUserId: number;
  onMessage: (message: ChatMessageData) => void;
  onRead: (messageIds: number[]) => void;
}

export function useChatWebSocket({ chatUuid, currentUserId, onMessage, onRead }: UseChatWebSocketArgs) {
  const onMessageRef = useRef(onMessage);
  const onReadRef = useRef(onRead);

  useEffect(() => {
    onMessageRef.current = onMessage;
    onReadRef.current = onRead;
  }, [onMessage, onRead]);

  useEffect(() => {
    if (!chatUuid || currentUserId <= 0) {
      return;
    }

    const wsUrl = buildChatWebSocketUrl(chatUuid);
    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let disposed = false;

    function connect() {
      if (disposed) {
        return;
      }

      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        void markChatMessagesRead(chatUuid).catch(() => undefined);
      };

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data) as { event?: string; data?: unknown };

          if (payload.event === "chat_message" && payload.data) {
            const message = payload.data as ChatMessageData;
            onMessageRef.current(message);

            if (message.sender_id !== currentUserId) {
              void markChatMessagesRead(chatUuid).catch(() => undefined);
            }
          }

          if (payload.event === "messages_read" && payload.data) {
            const ids = (payload.data as { message_ids?: number[] }).message_ids ?? [];
            onReadRef.current(ids);
          }
        } catch {
          // Ignore malformed frames.
        }
      };

      socket.onclose = () => {
        if (!disposed) {
          reconnectTimer = setTimeout(connect, 3000);
        }
      };

      socket.onerror = () => {
        socket?.close();
      };
    }

    connect();

    return () => {
      disposed = true;
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
      socket?.close();
    };
  }, [chatUuid, currentUserId]);
}