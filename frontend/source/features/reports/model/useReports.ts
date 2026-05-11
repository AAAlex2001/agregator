"use client";

import { useEffect, useState } from "react";
import { mapApiToOrderCard, type OrderCardData } from "@/source/entities/order";
import { fetchReports } from "../api/reports.api";

const PAGE_SIZE = 50;

export function useReports() {
  const [items, setItems] = useState<OrderCardData[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isLoadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchReports(0, PAGE_SIZE);
      setItems(data.items.map(mapApiToOrderCard));
      setHasMore(data.has_more);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (isLoading || isLoadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const data = await fetchReports(items.length, PAGE_SIZE);
      setItems((prev) => [...prev, ...data.items.map(mapApiToOrderCard)]);
      setHasMore(data.has_more);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка загрузки");
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => { void reload(); }, []);

  return { items, hasMore, isLoading, isLoadingMore, error, reload, loadMore };
}
