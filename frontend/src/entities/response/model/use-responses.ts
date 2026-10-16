"use client";

import { useEffect, useState } from "react";
import { getResponses } from "../api/get-responses";
import { EMPTY_RESPONSE_COUNTERS } from "../config/list";
import type {
  ResponseCounters,
  ResponseItem,
  ResponseQuery,
  ResponsesResult,
} from "./types";

/** Отклики последнего завершённого запроса и запрос, для которого они загружены. */
interface ResponsesState {
  query: ResponseQuery | null;
  items: ResponseItem[];
  counters: ResponseCounters;
  hasMore: boolean;
  isLoadingMore: boolean;
  error: string | null;
}

/** Загружает отклики вкладки заново при каждом новом объекте запроса и догружает страницы. */
export function useResponses(query: ResponseQuery): ResponsesResult {
  const [state, setState] = useState<ResponsesState>({
    query: null,
    items: [],
    counters: EMPTY_RESPONSE_COUNTERS,
    hasMore: false,
    isLoadingMore: false,
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    getResponses(query, 0)
      .then((page) => {
        if (isActive) {
          setState({
            query,
            items: page.items,
            counters: page.counters,
            hasMore: page.has_more,
            isLoadingMore: false,
            error: null,
          });
        }
      })
      .catch((error) => {
        if (isActive) {
          setState((current) => ({
            ...current,
            query,
            items: [],
            hasMore: false,
            isLoadingMore: false,
            error: error instanceof Error ? error.message : "Ошибка загрузки",
          }));
        }
      });

    return () => {
      isActive = false;
    };
  }, [query]);

  const isLoading = state.query !== query;

  /** Добавляет следующую страницу; ответ для прежней вкладки или порядка отбрасывается. */
  async function loadMore() {
    if (isLoading || state.isLoadingMore || !state.hasMore) {
      return;
    }

    setState({
      ...state,
      isLoadingMore: true,
    });

    try {
      const page = await getResponses(query, state.items.length);

      setState((current) => current.query === query ? {
        ...current,
        items: [...current.items, ...page.items],
        hasMore: page.has_more,
        isLoadingMore: false,
      } : current);
    } catch (error) {
      setState((current) => current.query === query ? {
        ...current,
        isLoadingMore: false,
        error: error instanceof Error ? error.message : "Ошибка загрузки",
      } : current);
    }
  }

  return {
    items: state.items,
    counters: state.counters,
    hasMore: state.hasMore,
    isLoadingMore: state.isLoadingMore,
    error: isLoading ? null : state.error,
    isLoading,
    loadMore,
  };
}
