"use client";

import { useEffect, useRef, useState } from "react";
import { fetchOrders } from "@/source/features/expert-orders";
import { searchOrdersPublic, type PublicOrderSearchFilters } from "../api/order-search.api";
import { mapApiToOrderCard } from "./mapper";
import type { OrderCardData } from "./types";

interface Args {
  pageSize?: number;
  onError?: (message: string) => void;
  initial?: { items: OrderCardData[]; hasMore: boolean };
  filters?: PublicOrderSearchFilters;
}

interface Result {
  items: OrderCardData[];
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  loadMore: () => Promise<void>;
}

export function usePublicOrdersList({ pageSize = 50, onError, initial, filters = {} }: Args = {}): Result {
  const [items, setItems] = useState<OrderCardData[]>(initial?.items ?? []);
  const [hasMore, setHasMore] = useState<boolean>(initial?.hasMore ?? false);
  const [isLoading, setIsLoading] = useState(!initial);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const inflightRef = useRef(false);
  const hasFilters = Boolean(filters.query?.trim() || filters.workType || filters.badgeCode);

  const fetchPage = (skip: number) =>
    hasFilters ? searchOrdersPublic(filters, skip, pageSize) : fetchOrders(skip, pageSize);

  useEffect(() => {
    if (initial) return;
    let cancelled = false;
    setIsLoading(true);
    fetchPage(0)
      .then((data) => {
        if (cancelled) return;
        setItems(data.items.map(mapApiToOrderCard));
        setHasMore(data.has_more);
      })
      .catch((err) => {
        if (cancelled) return;
        onError?.(err instanceof Error ? err.message : "Не удалось загрузить заказы");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, filters.query, filters.workType, filters.badgeCode]);

  const loadMore = async () => {
    if (isLoading || isLoadingMore || inflightRef.current) return;
    if (!hasMore) return;
    inflightRef.current = true;
    setIsLoadingMore(true);
    try {
      const data = await fetchPage(items.length);
      setItems((prev) => [...prev, ...data.items.map(mapApiToOrderCard)]);
      setHasMore(data.has_more);
    } catch (err) {
      onError?.(err instanceof Error ? err.message : "Не удалось загрузить заказы");
    } finally {
      inflightRef.current = false;
      setIsLoadingMore(false);
    }
  };

  return { items, hasMore, isLoading, isLoadingMore, loadMore };
}
