"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatDetailData, ChatMessageData } from "@/source/entities/chat";
import { fetchChatDetail, markChatMessagesRead } from "../api/chat.api";
import { useChatListContext } from "./chatListContext";
import { useChatWebSocket } from "./useChatWebSocket";

export function useChatThread(chatUuid: string | null, currentUserId: number) {
  const [chat, setChat] = useState<ChatDetailData | null>(null);
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const { markChatAsRead, syncChatMessage } = useChatListContext();

  useEffect(() => {
    if (!chatUuid) {
      setChat(null);
      setMessages([]);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    setLoading(true);
    setError(null);

    fetchChatDetail(chatUuid)
      .then((detail) => {
        if (cancelled) {
          return;
        }

        const hasUnreadFromCounterpart = detail.messages.some(
          (message) => !message.is_read && message.sender_id !== currentUserId,
        );
        const patchedMessages = hasUnreadFromCounterpart
          ? detail.messages.map((message) => (
              !message.is_read && message.sender_id !== currentUserId
                ? { ...message, is_read: true }
                : message
            ))
          : detail.messages;

        setChat(detail);
        setMessages(patchedMessages);
        markChatAsRead(chatUuid);

        if (hasUnreadFromCounterpart) {
          void markChatMessagesRead(chatUuid).catch(() => undefined);
        }
      })
      .catch((err) => {
        if (cancelled) {
          return;
        }

        setChat(null);
        setMessages([]);
        setError(err instanceof Error ? err.message : "Не удалось загрузить чат");
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [chatUuid]);

  useEffect(() => {
    const element = threadRef.current;
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }, [messages]);

  useChatWebSocket({
    chatUuid,
    currentUserId,
    onMessage: (message) => {
      setMessages((currentMessages) => (
        currentMessages.some((item) => item.id === message.id)
          ? currentMessages.map((item) => (item.id === message.id ? { ...item, ...message } : item))
          : [...currentMessages, message]
      ));

      if (chatUuid) {
        syncChatMessage(chatUuid, message, currentUserId);
      }

      if (chatUuid && message.sender_id !== currentUserId) {
        void markChatMessagesRead(chatUuid).then(() => {
          markChatAsRead(chatUuid);
        }).catch(() => undefined);
      }
    },
    onRead: (messageIds) => {
      if (messageIds.length === 0) {
        return;
      }

      const ids = new Set(messageIds);
      setMessages((currentMessages) => currentMessages.map((message) => (
        ids.has(message.id) ? { ...message, is_read: true } : message
      )));
    },
  });

  function appendMessage(message: ChatMessageData) {
    setMessages((currentMessages) => (
      currentMessages.some((item) => item.id === message.id)
        ? currentMessages
        : [...currentMessages, message]
    ));

    if (chatUuid) {
      syncChatMessage(chatUuid, message, currentUserId);
      markChatAsRead(chatUuid);
    }
  }

  return { chat, messages, loading, error, threadRef, appendMessage };
}