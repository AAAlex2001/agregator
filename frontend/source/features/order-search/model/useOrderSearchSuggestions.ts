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

export function useOrderSearchSuggestions({
  query,
  minChars = 2,
  limit = 6,
  debounceMs = 220,
}: Options): OrderSuggestion[] {
  const [items, setItems] = useState<OrderSuggestion[]>([]);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < minChars) {
      setItems([]);
      return;
    }
    const id = ++requestIdRef.current;
    const timer = window.setTimeout(() => {
      void searchOrdersPublic(trimmed, 0, limit)
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
        });
    }, debounceMs);
    return () => window.clearTimeout(timer);
  }, [query, minChars, limit, debounceMs]);

  return items;
}
