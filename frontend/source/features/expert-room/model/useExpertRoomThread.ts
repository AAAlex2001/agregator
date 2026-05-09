"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ExpertRoomMessageData } from "@/source/entities/expert-room";
import { useInfiniteScroll } from "@/source/shared/lib/useInfiniteScroll";
import { fetchExpertRoomHistory } from "../api/expert-room.api";
import { useExpertRoomWebSocket } from "./useExpertRoomWebSocket";
import { useTypingIndicator } from "./useTypingIndicator";

const STICK_TO_BOTTOM_THRESHOLD_PX = 60;

export function useExpertRoomThread(currentUserId: number) {
  const [messages, setMessages] = useState<ExpertRoomMessageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState(false);
  const [banReason, setBanReason] = useState<string | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const stickToBottomRef = useRef(true);

  const enabled = currentUserId > 0;
  const wsEnabled = enabled && !forbidden;
  const { typingEntries, handleTyping } = useTypingIndicator(currentUserId);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchExpertRoomHistory()
      .then((response) => {
        if (cancelled) return;
        setMessages(response.items);
        setHasMore(response.has_more);
        if (response.banned) {
          setForbidden(true);
          setBanReason(response.ban_reason);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Не удалось загрузить чат");
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
    if (!element || !stickToBottomRef.current) return;
    element.scrollTop = element.scrollHeight;
  }, [messages, typingEntries.length]);

  const loadOlder = useCallback(async () => {
    const oldest = messages[0];
    if (!oldest) return;

    const element = threadRef.current;
    const prevHeight = element?.scrollHeight ?? 0;

    setLoadingMore(true);
    try {
      const response = await fetchExpertRoomHistory(oldest.id);
      setMessages((current) => {
        const seen = new Set(current.map((m) => m.id));
        return [...response.items.filter((m) => !seen.has(m.id)), ...current];
      });
      setHasMore(response.has_more);

      requestAnimationFrame(() => {
        const next = threadRef.current;
        if (next) next.scrollTop = next.scrollHeight - prevHeight;
      });
    } finally {
      setLoadingMore(false);
    }
  }, [messages]);

  const topSentinelRef = useInfiniteScroll({
    hasMore,
    isLoading: loadingMore,
    onLoadMore: loadOlder,
    rootMargin: "100px",
  });

  const handleScroll = useCallback(() => {
    const element = threadRef.current;
    if (!element) return;
    const distanceFromBottom = element.scrollHeight - element.scrollTop - element.clientHeight;
    stickToBottomRef.current = distanceFromBottom < STICK_TO_BOTTOM_THRESHOLD_PX;
  }, []);

  const handleIncomingMessage = useCallback((message: ExpertRoomMessageData) => {
    setMessages((current) => (
      current.some((item) => item.id === message.id) ? current : [...current, message]
    ));
  }, []);

  const onForbidden = useCallback(() => {
    setForbidden(true);
  }, []);

  const { notifyTyping } = useExpertRoomWebSocket({
    enabled: wsEnabled,
    onMessage: handleIncomingMessage,
    onTyping: handleTyping,
    onForbidden,
  });

  const appendMine = useCallback((message: ExpertRoomMessageData) => {
    stickToBottomRef.current = true;
    setMessages((current) => (
      current.some((item) => item.id === message.id) ? current : [...current, message]
    ));
  }, []);

  return {
    messages,
    loading,
    loadingMore,
    hasMore,
    error,
    forbidden,
    banReason,
    threadRef,
    topSentinelRef,
    typingEntries,
    notifyTyping,
    appendMine,
    handleScroll,
  };
}
