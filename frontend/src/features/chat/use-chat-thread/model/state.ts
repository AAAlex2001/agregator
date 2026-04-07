"use client";

import { useEffect, useRef, useState } from "react";
import {
  fetchChatDetail,
  type ChatDetailResponse,
  type ChatMessage,
} from "@/shared/lib/chatApi";
import { useChatWebSocket } from "./useChatWebSocket";

export function useChatThread(chatUuid: string | null, currentUserId: number) {
  const [chat, setChat] = useState<ChatDetailResponse | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatUuid) return;
    let cancelled = false;
    setLoading(true);

    fetchChatDetail(chatUuid)
      .then((detail) => {
        if (cancelled) return;
        setChat(detail);
        setMessages(detail.messages);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [chatUuid]);

  useChatWebSocket({
    chatUuid,
    currentUserId,
    onMessage: (msg) =>
      setMessages((prev) =>
        prev.some((m) => m.id === msg.id)
          ? prev.map((m) => (m.id === msg.id ? { ...m, ...msg } : m))
          : [...prev, msg],
      ),
    onRead: (ids) => {
      if (ids.length === 0) return;
      const set = new Set(ids);
      setMessages((prev) => prev.map((m) => (set.has(m.id) ? { ...m, is_read: true } : m)));
    },
  });

  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  function appendMessage(msg: ChatMessage) {
    setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
  }

  return { chat, messages, loading, threadRef, appendMessage };
}
