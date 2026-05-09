"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ExpertRoomTypingPayload } from "@/source/entities/expert-room";

const TYPING_TTL_MS = 3000;

interface TypingEntry {
  user_id: number;
  user_name: string;
  expires_at: number;
}

export function useTypingIndicator(currentUserId: number) {
  const [entries, setEntries] = useState<TypingEntry[]>([]);
  const sweeperRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (entries.length === 0) {
      return;
    }
    sweeperRef.current = setInterval(() => {
      const now = Date.now();
      setEntries((current) => current.filter((entry) => entry.expires_at > now));
    }, 500);

    return () => {
      if (sweeperRef.current) {
        clearInterval(sweeperRef.current);
        sweeperRef.current = null;
      }
    };
  }, [entries.length]);

  const handleTyping = useCallback((payload: ExpertRoomTypingPayload) => {
    if (payload.user_id === currentUserId) {
      return;
    }
    const expires_at = Date.now() + TYPING_TTL_MS;
    setEntries((current) => {
      const without = current.filter((entry) => entry.user_id !== payload.user_id);
      return [...without, { user_id: payload.user_id, user_name: payload.user_name, expires_at }];
    });
  }, [currentUserId]);

  return { typingEntries: entries, handleTyping };
}
