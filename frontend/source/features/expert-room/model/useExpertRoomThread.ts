"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ExpertRoomMessageData } from "@/source/entities/expert-room";
import { fetchExpertRoomHistory } from "../api/expert-room.api";
import { useExpertRoomWebSocket } from "./useExpertRoomWebSocket";
import { useTypingIndicator } from "./useTypingIndicator";

export function useExpertRoomThread(currentUserId: number) {
  const [messages, setMessages] = useState<ExpertRoomMessageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);

  const enabled = currentUserId > 0 && !forbidden;
  const { typingEntries, handleTyping } = useTypingIndicator(currentUserId);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchExpertRoomHistory()
      .then((response) => {
        if (cancelled) return;
        setMessages(response.items);
      })
      .catch((err) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Не удалось загрузить чат";
        setError(message);
        if (message.toLowerCase().includes("заблокированы")) {
          setForbidden(true);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  useEffect(() => {
    const element = threadRef.current;
    if (!element) return;
    element.scrollTop = element.scrollHeight;
  }, [messages, typingEntries.length]);

  const handleIncomingMessage = useCallback((message: ExpertRoomMessageData) => {
    setMessages((current) => (
      current.some((item) => item.id === message.id) ? current : [...current, message]
    ));
  }, []);

  const onForbidden = useCallback(() => {
    setForbidden(true);
    setError("Вы заблокированы в чате экспертов");
  }, []);

  const { notifyTyping } = useExpertRoomWebSocket({
    enabled,
    onMessage: handleIncomingMessage,
    onTyping: handleTyping,
    onForbidden,
  });

  const appendMine = useCallback((message: ExpertRoomMessageData) => {
    setMessages((current) => (
      current.some((item) => item.id === message.id) ? current : [...current, message]
    ));
  }, []);

  return {
    messages,
    loading,
    error,
    forbidden,
    threadRef,
    typingEntries,
    notifyTyping,
    appendMine,
  };
}
