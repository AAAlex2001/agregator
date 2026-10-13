"use client";

import { useEffect, useRef, useState } from "react";
import { fetchFollowingUnseen, markFollowingSeen } from "@/source/entities/posts";

/** Показывает число новых публикаций и отмечает подписки просмотренными. */
export function useFollowingUnseen(userId?: number) {
  const [count, setCount] = useState(0);
  const request = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!userId) return;
    const controller = new AbortController();
    request.current = controller;
    async function load() {
      try {
        const result = await fetchFollowingUnseen(controller.signal);
        if (!controller.signal.aborted) setCount(result.count);
      } catch {
        // Подписки доступны и без счётчика новых публикаций.
      }
    }
    void load();
    return () => controller.abort();
  }, [userId]);

  const seen = async () => {
    request.current?.abort();
    try {
      await markFollowingSeen();
      setCount(0);
    } catch {
      // Следующий вход повторит отметку просмотра.
    }
  };

  return { count, seen };
}
