"use client";

import { useEffect, useRef, useState } from "react";
import { searchOrdersPublic, type PublicOrderSearchFilters } from "@/source/entities/order";

export interface OrderSuggestion {
  id: number;
  publicId: string;
  title: string;
  company: string;
}

interface Options {
  query: string;
  minChars?: number;
  limit?: number;
  debounceMs?: number;
  filters?: PublicOrderSearchFilters;
}

export interface OrderSearchState {
  items: OrderSuggestion[];
  isLoading: boolean;
  hasQuery: boolean;
}

export function useOrderSearchSuggestions({
  query,
  minChars = 2,
  limit = 6,
  debounceMs = 220,
  filters = {},
}: Options): OrderSearchState {
  const trimmed = query.trim();
  const workType = filters.workType;
  const badgeCode = filters.badgeCode;
  const hasFilter = Boolean(workType || badgeCode);
  const hasQuery = trimmed.length >= minChars || hasFilter;

  const [items, setItems] = useState<OrderSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!hasQuery) {
      requestIdRef.current += 1;
      return;
    }
    const id = ++requestIdRef.current;
    const timer = window.setTimeout(() => {
      setIsLoading(true);
      void searchOrdersPublic({ workType, badgeCode, query: trimmed || undefined }, 0, limit)
        .then((data) => {
          if (id !== requestIdRef.current) return;
          setItems(
            data.items.map((item) => ({
              id: item.id,
              publicId: item.public_id,
              title: item.title,
              company: item.company,
            })),
          );
        })
        .catch(() => {
          if (id !== requestIdRef.current) return;
          setItems([]);
        })
        .finally(() => {
          if (id === requestIdRef.current) setIsLoading(false);
        });
    }, debounceMs);
    return () => window.clearTimeout(timer);
  }, [trimmed, hasQuery, limit, debounceMs, workType, badgeCode]);

  return {
    items: hasQuery ? items : [],
    isLoading: hasQuery && isLoading,
    hasQuery,
  };
}
