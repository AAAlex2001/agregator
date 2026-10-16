"use client";

import { useEffect, useState } from "react";
import { getCompanySuggestions } from "../api/get-company-suggestions";
import type { CompanySuggestion } from "./types";

/** Компании вместе с запросом, для которого они найдены. */
interface SuggestionsResult {
  query: string;
  items: CompanySuggestion[];
}

/** Загружает подсказки после паузы ввода; без ответа сервиса список остаётся пустым. */
export function useCompanySuggestions(query: string, enabled: boolean) {
  const [result, setResult] = useState<SuggestionsResult | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let isActive = true;
    const timer = setTimeout(() => {
      getCompanySuggestions(query)
        .then((items) => {
          if (isActive) {
            setResult({ query, items });
          }
        })
        .catch(() => {
          if (isActive) {
            setResult({ query, items: [] });
          }
        });
    }, 250);

    return () => {
      isActive = false;
      clearTimeout(timer);
    };
  }, [query, enabled]);

  return result?.query === query ? result.items : null;
}
