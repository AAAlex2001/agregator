"use client";

import { useEffect, useState } from "react";
import { fetchArchivedOrders } from "../api/archive.api";
import { mapApiToOrderCard } from "@/source/entities/order";
import type { OrderCardData } from "@/source/entities/order";

export function useArchive() {
  const [items, setItems] = useState<OrderCardData[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchArchivedOrders()
      .then((data) => {
        if (cancelled) return;
        setItems(data.items.map(mapApiToOrderCard));
        setTotal(data.total);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Ошибка загрузки");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { items, total, isLoading, error };
}
