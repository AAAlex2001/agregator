"use client";

import { useEffect, useState } from "react";
import { searchOrders } from "../api/search-orders";
import { ORDER_SEARCH_DELAY, ORDER_SUGGESTION_LIMIT } from "../config/search";
import type { OrderListItem } from "./order-list-item";
import type { OrderSearchSuggestions } from "./search-suggestions";

/** Загружает подсказки после паузы ввода и игнорирует ответы прежних запросов. */
export function useOrderSearchSuggestions(
  query: string,
  badgeCode: string,
): OrderSearchSuggestions {
  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery.length > 0;
  const [items, setItems] = useState<OrderListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!trimmedQuery) {
      return;
    }

    let isActive = true;

    /** Применяет результат, пока строка и фильтр поиска остаются прежними. */
    async function loadSuggestions() {
      setIsLoading(true);

      try {
        const result = await searchOrders(
          trimmedQuery,
          badgeCode,
          ORDER_SUGGESTION_LIMIT,
        );

        if (isActive) {
          setItems(result.items);
        }
      } catch {
        if (isActive) {
          setItems([]);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    const timer = window.setTimeout(loadSuggestions, ORDER_SEARCH_DELAY);

    return () => {
      isActive = false;
      window.clearTimeout(timer);
    };
  }, [trimmedQuery, badgeCode]);

  return {
    items: hasQuery ? items : [],
    isLoading: hasQuery && isLoading,
    hasQuery,
  };
}
