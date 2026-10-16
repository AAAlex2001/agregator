"use client";

import { useEffect, useState } from "react";
import { getExperts } from "../api/get-experts";
import type { ExpertSort, ExpertSummaryPage } from "./types";

/** Исполнители последнего завершённого запроса и ключ, для которого они загружены. */
interface ExpertsListState {
  requestKey: string | null;
  page: ExpertSummaryPage | null;
  error: string | null;
}

/** Загружает рейтинг исполнителей, меняет его порядок и догружает страницы. */
export function useExpertsList() {
  const [state, setState] = useState<ExpertsListState>({
    requestKey: null,
    page: null,
    error: null,
  });
  const [sort, setSort] = useState<ExpertSort>({
    field: null,
    direction: null,
  });
  const [loadVersion, setLoadVersion] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const requestKey = `${sort.field}:${sort.direction}:${loadVersion}`;

  useEffect(() => {
    let isActive = true;

    getExperts(0, sort)
      .then((page) => {
        if (isActive) {
          setState({
            requestKey,
            page,
            error: null,
          });
        }
      })
      .catch((error) => {
        if (isActive) {
          setState({
            requestKey,
            page: null,
            error: error instanceof Error ? error.message : "Не удалось загрузить исполнителей",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [sort, requestKey]);

  const isLoading = state.requestKey !== requestKey;
  const page = isLoading ? null : state.page;

  /** Загружает первую страницу заново после ошибки. */
  function reload() {
    setLoadVersion(loadVersion + 1);
  }

  /** Добавляет следующую страницу исполнителей в конец списка. */
  async function loadMore() {
    if (!page || !page.has_more || isLoadingMore) {
      return;
    }

    setIsLoadingMore(true);

    try {
      const nextPage = await getExperts(page.items.length, sort);

      setState({
        requestKey,
        page: {
          items: [...page.items, ...nextPage.items],
          has_more: nextPage.has_more,
        },
        error: null,
      });
    } catch (error) {
      setState({
        requestKey,
        page,
        error: error instanceof Error ? error.message : "Не удалось загрузить исполнителей",
      });
    } finally {
      setIsLoadingMore(false);
    }
  }

  return {
    page,
    sort,
    error: isLoading ? null : state.error,
    isLoading,
    isLoadingMore,
    changeSort: setSort,
    reload,
    loadMore,
  };
}
