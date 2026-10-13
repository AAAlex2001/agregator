"use client";

import { useEffect, useRef, useState } from "react";
import { fetchPost, type Post } from "@/source/entities/posts";

/** Загружает публикацию; повторный запрос отменяет предыдущий. */
export function usePost(id: number, initialPost?: Post) {
  const [post, setPost] = useState<Post | null>(initialPost ?? null);
  const [loading, setLoading] = useState(!initialPost);
  const [error, setError] = useState("");
  const request = useRef<AbortController | null>(null);

  /** Получает публикацию и обновляет состояние загрузки. */
  async function load(postId: number) {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setLoading(true);
    setError("");

    try {
      const result = await fetchPost(postId, controller.signal);
      if (!controller.signal.aborted) setPost(result);
    } catch (failure) {
      if (!controller.signal.aborted) {
        setError(failure instanceof Error ? failure.message : "Не удалось загрузить публикацию");
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }

  useEffect(() => {
    void load(id);
    return () => request.current?.abort();
  }, [id]);

  return {
    post,
    loading,
    error,
    reload: () => load(id),
  };
}
