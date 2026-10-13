"use client";

import { useEffect, useRef, useState } from "react";
import { fetchPostPage, type PostPage, type PostFeedQuery } from "@/source/entities/posts";

/** Загружает раздел публикаций и его следующие страницы. */
export function usePostList(query: PostFeedQuery, initial?: PostPage, offset = 0) {
  const { mode, status, authorId } = query;
  const [page, setPage] = useState<PostPage>(initial ?? { items: [], total: 0 });
  const [loading, setLoading] = useState(!initial);
  const [error, setError] = useState("");
  const request = useRef<AbortController | null>(null);

  /** Загружает страницу или добавляет следующую порцию. */
  async function load(feed: PostFeedQuery, next: number, append = false) {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setLoading(true);
    setError("");

    try {
      const result = await fetchPostPage(feed, next, controller.signal);
      if (controller.signal.aborted) return;
      setPage((previous) => ({
        ...result,
        items: append ? [...previous.items, ...result.items] : result.items,
      }));
    } catch (failure) {
      if (!controller.signal.aborted) {
        setError(failure instanceof Error ? failure.message : "Не удалось загрузить публикации");
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }

  useEffect(() => {
    void load({ mode, status, authorId }, offset);
    return () => request.current?.abort();
  }, [mode, status, authorId, offset]);

  return {
    ...page,
    loading,
    loadingMore: loading && page.items.length > 0,
    error,
    hasMore: offset + page.items.length < page.total,
    reload: () => load(query, offset),
    loadMore: () => load(
      query,
      offset + page.items.length,
      page.items.length > 0,
    ),
  };
}
