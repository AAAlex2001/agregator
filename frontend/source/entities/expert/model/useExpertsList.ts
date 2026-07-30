"use client";

import { useEffect, useState } from "react";
import type { SortDir } from "@/source/shared/ui/SortPills";
import { fetchExperts } from "../api/experts.api";
import { mapExpertList } from "./mapper";
import type { ExpertSortBy, ExpertSummary } from "./types";

const PAGE_SIZE = 20;

interface UseExpertsListResult {
  items: ExpertSummary[];
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  sortBy: ExpertSortBy | null;
  sortDir: SortDir | null;
  setSort: (sortBy: ExpertSortBy | null, sortDir: SortDir | null) => void;
  reload: () => Promise<void>;
  loadMore: () => Promise<void>;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Не удалось загрузить исполнителей";
}

export function useExpertsList(): UseExpertsListResult {
  const [items, setItems] = useState<ExpertSummary[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<ExpertSortBy | null>(null);
  const [sortDir, setSortDir] = useState<SortDir | null>(null);

  const fetchInitial = async (sb: ExpertSortBy | null, sd: SortDir | null): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchExperts({
        skip: 0,
        limit: PAGE_SIZE,
        sortBy: sb ?? undefined,
        sortDir: sd ?? undefined,
      });
      const mapped = mapExpertList(data);
      setItems(mapped.items);
      setHasMore(mapped.hasMore);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const reload = (): Promise<void> => fetchInitial(sortBy, sortDir);

  const loadMore = async (): Promise<void> => {
    if (isLoading || isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    try {
      const data = await fetchExperts({
        skip: items.length,
        limit: PAGE_SIZE,
        sortBy: sortBy ?? undefined,
        sortDir: sortDir ?? undefined,
      });
      const mapped = mapExpertList(data);
      setItems((prev) => [...prev, ...mapped.items]);
      setHasMore(mapped.hasMore);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoadingMore(false);
    }
  };

  const setSort = (sb: ExpertSortBy | null, sd: SortDir | null) => {
    setSortBy(sb);
    setSortDir(sd);
    void fetchInitial(sb, sd);
  };

  useEffect(() => {
    void fetchInitial(null, null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    items, hasMore, isLoading, isLoadingMore, error,
    sortBy, sortDir, setSort, reload, loadMore,
  };
}
