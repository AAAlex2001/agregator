"use client";

import { useEffect, useState } from "react";
import { searchOrders } from "@/source/entities/order";

const DEBOUNCE_MS = 220;
const LIMIT = 6;

export interface OrderSuggestion {
  id: number;
  publicId: string;
  title: string;
  company: string;
}

export interface OrderSearchState {
  items: OrderSuggestion[];
  isLoading: boolean;
  hasQuery: boolean;
}

/** Подсказки по заказам: запрос уходит через 220 мс после последнего нажатия. */
export function useOrderSearchSuggestions(query: string, badgeCode: string): OrderSearchState {
  const trimmed = query.trim();
  const hasQuery = trimmed.length > 0;
  const [items, setItems] = useState<OrderSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!trimmed) return;
    let cancelled = false;
    const timer = window.setTimeout(() => {
      setIsLoading(true);
      searchOrders(trimmed, badgeCode, LIMIT)
        .then((data) => {
          if (cancelled) return;
          setItems(data.items.map((item) => ({ id: item.id, publicId: item.public_id, title: item.title, company: item.company })));
        })
        .catch(() => {
          if (!cancelled) setItems([]);
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false);
        });
    }, DEBOUNCE_MS);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [trimmed, badgeCode]);

  return { items: hasQuery ? items : [], isLoading: hasQuery && isLoading, hasQuery };
}
