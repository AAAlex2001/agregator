"use client";

import { useEffect, useRef, useState } from "react";
import { fetchThreads, type ThreadPage } from "@/source/entities/posts";

/** Загружает комментарии и следующие страницы обсуждения. */
export function useComments(postId: number) {
  const [page, setPage] = useState<ThreadPage>({
    items: [],
    total: 0,
    comments_count: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const request = useRef<AbortController | null>(null);

  /** Загружает страницу комментариев и отменяет предыдущий запрос. */
  async function load(id: number, offset: number) {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setLoading(true);
    setError("");

    try {
      const result = await fetchThreads(id, 20, offset, controller.signal);
      if (controller.signal.aborted) return;
      setPage((previous) => ({
        ...result,
        items: offset === 0 ? result.items : [...previous.items, ...result.items],
      }));
    } catch (failure) {
      if (!controller.signal.aborted) {
        setError(failure instanceof Error ? failure.message : "Не удалось загрузить комментарии");
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }

  useEffect(() => {
    void load(postId, 0);
    return () => request.current?.abort();
  }, [postId]);

  return {
    ...page,
    loading,
    error,
    hasMore: page.items.length < page.total,
    reload: () => load(postId, 0),
    loadMore: () => load(postId, page.items.length),
  };
}
