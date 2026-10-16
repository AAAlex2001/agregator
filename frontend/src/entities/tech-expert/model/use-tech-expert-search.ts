"use client";

import { useEffect, useState } from "react";
import { searchTechExpertDocuments } from "../api/search-tech-expert-documents";
import type { TechExpertSearchResult } from "./types";

/** Результат последнего поиска и строка, по которой он получен. */
interface TechExpertSearchState {
  query: string | null;
  result: TechExpertSearchResult | null;
  error: string | null;
}

/** Ищет документы по отправленной строке; null означает, что поиск ещё не запускали. */
export function useTechExpertSearch(query: string | null) {
  const [state, setState] = useState<TechExpertSearchState>({
    query: null,
    result: null,
    error: null,
  });

  useEffect(() => {
    if (query === null) {
      return;
    }

    let isActive = true;

    searchTechExpertDocuments(query)
      .then((result) => {
        if (isActive) {
          setState({
            query,
            result,
            error: null,
          });
        }
      })
      .catch((error) => {
        if (isActive) {
          setState({
            query,
            result: null,
            error: error instanceof Error ? error.message : "Не удалось выполнить поиск",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [query]);

  const isCurrent = query !== null && state.query === query;

  return {
    result: isCurrent ? state.result : null,
    error: isCurrent ? state.error : null,
    isLoading: query !== null && !isCurrent,
  };
}
