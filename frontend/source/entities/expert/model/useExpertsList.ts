"use client";

import { useEffect, useState } from "react";
import { fetchExperts } from "../api/experts.api";
import { mapExpertList } from "./mapper";
import type { ExpertSummary } from "./types";

const PAGE_SIZE = 20;

interface UseExpertsListResult {
  items: ExpertSummary[];
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  reload: () => Promise<void>;
  loadMore: () => Promise<void>;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Не удалось загрузить экспертов";
}

export function useExpertsList(): UseExpertsListResult {
  const [items, setItems] = useState<ExpertSummary[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchExperts({ skip: 0, limit: PAGE_SIZE });
      const mapped = mapExpertList(data);
      setItems(mapped.items);
      setHasMore(mapped.hasMore);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = async (): Promise<void> => {
    if (isLoading || isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    try {
      const data = await fetchExperts({ skip: items.length, limit: PAGE_SIZE });
      const mapped = mapExpertList(data);
      setItems((prev) => [...prev, ...mapped.items]);
      setHasMore(mapped.hasMore);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { items, hasMore, isLoading, isLoadingMore, error, reload, loadMore };
}
