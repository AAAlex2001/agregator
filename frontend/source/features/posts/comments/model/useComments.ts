"use client";

import { useState } from "react";
import { fetchThreads, type ThreadPage } from "@/source/entities/posts";
import { useNotifications } from "@/source/shared/ui/Notifications";

/** Обсуждение публикации: первая страница приходит с сервера, следующие и обновление — по запросу. */
export function useComments(postId: number, initial: ThreadPage) {
  const { showError } = useNotifications();
  const [page, setPage] = useState(initial);
  const [isLoading, setIsLoading] = useState(false);

  const load = async (offset: number) => {
    setIsLoading(true);
    try {
      const next = await fetchThreads(postId, offset);
      setPage(offset === 0 ? next : { ...next, items: [...page.items, ...next.items] });
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось загрузить комментарии");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    ...page,
    isLoading,
    hasMore: page.items.length < page.total,
    reload: () => load(0),
    loadMore: () => load(page.items.length),
  };
}
