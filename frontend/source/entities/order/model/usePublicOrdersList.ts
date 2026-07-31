"use client";

import { useEffect, useRef, useState } from "react";
import type { SortDir } from "@/source/shared/ui/SortPills";
import { fetchOrders } from "../api/expert-orders.api";
import { mapApiToOrderCard } from "./mapper";
import type { OrderCardData, OrderSortBy } from "./types";

interface Args {
  pageSize?: number;
  onError?: (message: string) => void;
  initial?: { items: OrderCardData[]; hasMore: boolean };
}

interface Result {
  items: OrderCardData[];
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  sortBy: OrderSortBy | null;
  sortDir: SortDir | null;
  setSort: (sortBy: OrderSortBy | null, sortDir: SortDir | null) => void;
  loadMore: () => Promise<void>;
}

export function usePublicOrdersList({ pageSize = 50, onError, initial }: Args = {}): Result {
  const [items, setItems] = useState<OrderCardData[]>(initial?.items ?? []);
  const [hasMore, setHasMore] = useState<boolean>(initial?.hasMore ?? false);
  const [isLoading, setIsLoading] = useState(!initial);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [sortBy, setSortBy] = useState<OrderSortBy | null>(null);
  const [sortDir, setSortDir] = useState<SortDir | null>(null);
  const inflightRef = useRef(false);

  const load = async (sb: OrderSortBy | null, sd: SortDir | null) => {
    setIsLoading(true);
    try {
      const data = await fetchOrders(0, pageSize, { sortBy: sb ?? undefined, sortDir: sd ?? undefined });
      setItems(data.items.map(mapApiToOrderCard));
      setHasMore(data.has_more);
    } catch (err) {
      onError?.(err instanceof Error ? err.message : "Не удалось загрузить заказы");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initial) return;
    void load(null, null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize]);

  const setSort = (sb: OrderSortBy | null, sd: SortDir | null) => {
    setSortBy(sb);
    setSortDir(sd);
    void load(sb, sd);
  };

  const loadMore = async () => {
    if (isLoading || isLoadingMore || inflightRef.current || !hasMore) return;
    inflightRef.current = true;
    setIsLoadingMore(true);
    try {
      const data = await fetchOrders(items.length, pageSize, {
        sortBy: sortBy ?? undefined,
        sortDir: sortDir ?? undefined,
      });
      setItems((prev) => [...prev, ...data.items.map(mapApiToOrderCard)]);
      setHasMore(data.has_more);
    } catch (err) {
      onError?.(err instanceof Error ? err.message : "Не удалось загрузить заказы");
    } finally {
      inflightRef.current = false;
      setIsLoadingMore(false);
    }
  };

  return { items, hasMore, isLoading, isLoadingMore, sortBy, sortDir, setSort, loadMore };
}
