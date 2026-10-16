"use client";

import { useState } from "react";
import { useNotifications } from "@/shared/ui/notifications";
import { getPostComments } from "../api/get-post-comments";
import type { PostCommentPage } from "./types";

/** Обсуждение публикации: первая страница приходит с сервера, следующие — по запросу. */
export function usePostComments(postId: number, initial: PostCommentPage) {
  const { showError } = useNotifications();
  const [page, setPage] = useState(initial);
  const [isLoading, setIsLoading] = useState(false);

  /** Перечитывает обсуждение с начала после нового, изменённого или удалённого комментария. */
  async function reload() {
    setIsLoading(true);

    try {
      const firstPage = await getPostComments(postId, 0);

      setPage(firstPage);
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Не удалось загрузить комментарии",
      );
    } finally {
      setIsLoading(false);
    }
  }

  /** Добавляет следующую страницу веток под уже показанными. */
  async function loadMore() {
    setIsLoading(true);

    try {
      const next = await getPostComments(postId, page.items.length);

      setPage({
        ...next,
        items: [...page.items, ...next.items],
      });
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Не удалось загрузить комментарии",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return {
    page,
    isLoading,
    hasMore: page.items.length < page.total,
    reload,
    loadMore,
  };
}
