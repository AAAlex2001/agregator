"use client";

import { useEffect, useState } from "react";
import { getAddressSuggestions } from "@/shared/ui/address-picker";

/** Найденные города вместе с запросом, на который они получены. */
interface CitySuggestions {
  query: string;
  cities: string[];
}

/** Запрашивает города после паузы ввода и отбрасывает ответы на прежний запрос. */
export function useCitySuggestions(query: string | null) {
  const [result, setResult] = useState<CitySuggestions>({
    query: "",
    cities: [],
  });

  useEffect(() => {
    if (query === null || query.trim().length < 2) {
      return;
    }

    let cancelled = false;
    const timer = setTimeout(() => {
      getAddressSuggestions(query.trim())
        .then((addresses) => {
          if (cancelled) {
            return;
          }

          const cities = addresses
            .map((address) => address.city ?? address.address)
            .filter((city) => city.length > 0);

          setResult({ query, cities: [...new Set(cities)] });
        })
        .catch(() => {
          if (!cancelled) {
            setResult({ query, cities: [] });
          }
        });
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  return result.query === query ? result.cities : [];
}
