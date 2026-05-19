"use client";

import { useEffect, useState } from "react";
import { mapApiToOrderCard } from "@/source/entities/order";
import type { OrderCardData } from "@/source/entities/order";
import { fetchExpertOrdersHistory, fetchExpertSummary } from "../api/experts.api";
import { mapExpertSummary } from "./mapper";
import type { ExpertSummary } from "./types";

const PAGE_SIZE = 20;

interface UseExpertOrdersHistoryResult {
  expert: ExpertSummary | null;
  items: OrderCardData[];
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  reload: () => Promise<void>;
  loadMore: () => Promise<void>;
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function useExpertOrdersHistory(publicId: string): UseExpertOrdersHistoryResult {
  const [expert, setExpert] = useState<ExpertSummary | null>(null);
  const [items, setItems] = useState<OrderCardData[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const [summaryApi, ordersApi] = await Promise.all([
        fetchExpertSummary(publicId),
        fetchExpertOrdersHistory(publicId, { skip: 0, limit: PAGE_SIZE }),
      ]);
      setExpert(mapExpertSummary(summaryApi));
      setItems(ordersApi.items.map(mapApiToOrderCard));
      setHasMore(ordersApi.has_more);
    } catch (err) {
      setError(getErrorMessage(err, "Не удалось загрузить историю заказов"));
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = async (): Promise<void> => {
    if (isLoading || isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    try {
      const data = await fetchExpertOrdersHistory(publicId, {
        skip: items.length,
        limit: PAGE_SIZE,
      });
      setItems((prev) => [...prev, ...data.items.map(mapApiToOrderCard)]);
      setHasMore(data.has_more);
    } catch (err) {
      setError(getErrorMessage(err, "Не удалось загрузить историю заказов"));
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicId]);

  return { expert, items, hasMore, isLoading, isLoadingMore, error, reload, loadMore };
}
