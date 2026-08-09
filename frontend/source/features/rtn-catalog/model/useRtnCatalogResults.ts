"use client";

import { useEffect, useState } from "react";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { fetchRtnList, type RtnList, type RtnListFilters } from "@/source/entities/rtn-clarification";

const PAGE_SIZE = 12;

export function useRtnCatalogResults(initial: RtnList, filters: RtnListFilters) {
  const { showError } = useNotifications();
  const [items, setItems] = useState(initial.items);
  const [hasMore, setHasMore] = useState(initial.has_more);
  const [offset, setOffset] = useState(initial.items.length);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    setItems(initial.items);
    setHasMore(initial.has_more);
    setOffset(initial.items.length);
  }, [initial]);

  const loadMore = async () => {
    if (!hasMore || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const page = await fetchRtnList({ ...filters, limit: PAGE_SIZE, offset });
      setItems((prev) => [...prev, ...page.items]);
      setHasMore(page.has_more);
      setOffset((value) => value + page.items.length);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось подгрузить разъяснения");
    } finally {
      setIsLoadingMore(false);
    }
  };

  return { items, hasMore, isLoadingMore, loadMore };
}
