"use client";

import { useEffect, useRef, useState } from "react";
import { fetchOrders } from "@/source/features/expert-orders";
import { mapApiToOrderCard } from "./mapper";
import type { OrderCardData } from "./types";

interface Args {
  pageSize?: number;
  onError?: (message: string) => void;
}

interface Result {
  items: OrderCardData[];
  total: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  loadMore: () => Promise<void>;
}

export function usePublicOrdersList({ pageSize = 50, onError }: Args = {}): Result {
  const [items, setItems] = useState<OrderCardData[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const inflightRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    fetchOrders(0, pageSize)
      .then((data) => {
        if (cancelled) return;
        setItems(data.items.map(mapApiToOrderCard));
        setTotal(data.total);
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
  }, [pageSize]);

  const loadMore = async () => {
    if (isLoading || isLoadingMore || inflightRef.current) return;
    if (items.length >= total) return;
    inflightRef.current = true;
    setIsLoadingMore(true);
    try {
      const data = await fetchOrders(items.length, pageSize);
      setItems((prev) => [...prev, ...data.items.map(mapApiToOrderCard)]);
      setTotal(data.total);
    } catch (err) {
      onError?.(err instanceof Error ? err.message : "Не удалось загрузить заказы");
    } finally {
      inflightRef.current = false;
      setIsLoadingMore(false);
    }
  };

  return { items, total, isLoading, isLoadingMore, loadMore };
}
