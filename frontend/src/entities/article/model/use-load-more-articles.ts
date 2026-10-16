"use client";

import { useNotifications } from "@/shared/ui/notifications";
import { getArticles } from "../api/get-articles";
import { BLOG_PAGE_SIZE } from "../config/list";
import { useArticleListContext } from "./list-context";

/** Догружает статьи после уже показанной части списка. */
export function useLoadMoreArticles() {
  const { kind, state, dispatch, requestVersionRef } = useArticleListContext();
  const { showError } = useNotifications();

  /** Добавляет следующую страницу, если пользователь ещё не сменил фильтры. */
  async function loadMoreArticles() {
    if (state.operation !== "idle" || !state.hasMore) {
      return;
    }

    const requestVersion = requestVersionRef.current;
    dispatch({ type: "more/started" });

    try {
      const page = await getArticles({
        kind,
        limit: BLOG_PAGE_SIZE,
        offset: state.offset,
        tag: state.filters.tag,
        direction: state.filters.direction,
      });

      if (requestVersion === requestVersionRef.current) {
        dispatch({
          type: "more/loaded",
          page,
        });
      }
    } catch (error) {
      if (requestVersion === requestVersionRef.current) {
        dispatch({ type: "request/failed" });
        showError(
          error instanceof Error ? error.message : "Не удалось подгрузить",
        );
      }
    }
  }

  return loadMoreArticles;
}
