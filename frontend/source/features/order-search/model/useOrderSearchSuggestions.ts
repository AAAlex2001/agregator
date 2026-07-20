"use client";

import { useEffect, useRef, useState } from "react";
import { searchOrdersPublic } from "@/source/entities/order";

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
}: Options): OrderSearchState {
  const trimmed = query.trim();
  const hasQuery = trimmed.length >= minChars;

  const [items, setItems] = useState<OrderSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!hasQuery) {
      setItems([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const id = ++requestIdRef.current;
    const timer = window.setTimeout(() => {
      void searchOrdersPublic({ query: trimmed }, 0, limit)
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
  }, [trimmed, hasQuery, limit, debounceMs]);

  return { items, isLoading, hasQuery };
}
