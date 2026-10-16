"use client";

import { useNotifications } from "@/shared/ui/notifications";
import { getRtnList } from "../api/get-rtn-list";
import { RTN_PAGE_SIZE } from "../config/pagination";
import { useRtnListContext } from "./list-context";

/** Загружает следующую часть текущей выдачи без перехода на другую страницу. */
export function useLoadMoreRtn() {
  const { filters, state, dispatch } = useRtnListContext();
  const { showError } = useNotifications();

  /** Добавляет разъяснения после уже показанных, оставляя их при ошибке. */
  async function loadMore() {
    if (state.isLoading || !state.hasMore) {
      return;
    }

    dispatch({ type: "more/started" });

    try {
      const page = await getRtnList({
        filters,
        limit: RTN_PAGE_SIZE,
        offset: state.items.length,
      });

      dispatch({ type: "more/loaded", page });
    } catch (error) {
      dispatch({ type: "more/failed" });
      showError(
        error instanceof Error
          ? error.message
          : "Не удалось подгрузить разъяснения",
      );
    }
  }

  return loadMore;
}
