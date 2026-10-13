"use client";

import { useEffect, useRef, useState } from "react";
import { fetchMyPostCounts, type PostCounts } from "@/source/entities/posts";

/** Загружает счётчики своих публикаций и обновляет их после удаления. */
export function usePostCounts(userId?: number) {
  const [counts, setCounts] = useState<PostCounts | null>(null);

  const request = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!userId) return;
    const controller = new AbortController();
    request.current = controller;
    async function load() {
      try {
        const result = await fetchMyPostCounts(controller.signal);
        if (!controller.signal.aborted) setCounts(result);
      } catch {
        // Раздел доступен и без необязательных счётчиков.
      }
    }
    void load();
    return () => request.current?.abort();
  }, [userId]);

  const reload = async () => {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    try {
      const result = await fetchMyPostCounts(controller.signal);
      if (!controller.signal.aborted) setCounts(result);
    } catch {
      // Сохраняем прежние счётчики до следующей загрузки.
    }
  };

  return { counts, reload };
}
