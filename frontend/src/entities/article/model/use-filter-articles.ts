"use client";

import { useNotifications } from "@/shared/ui/notifications";
import { getArticles } from "../api/get-articles";
import { BLOG_PAGE_SIZE } from "../config/list";
import { useArticleListContext } from "./list-context";
import type { ArticleFilters } from "./list-state";

/** Загружает первую страницу статей по выбранным фильтрам. */
export function useFilterArticles() {
  const { kind, dispatch, requestVersionRef } = useArticleListContext();
  const { showError } = useNotifications();

  /** Применяет только ответ для последнего выбора тега и направления. */
  async function filterArticles(filters: ArticleFilters) {
    const requestVersion = ++requestVersionRef.current;

    dispatch({
      type: "filter/started",
      filters,
    });

    try {
      const page = await getArticles({
        kind,
        limit: BLOG_PAGE_SIZE,
        offset: 0,
        tag: filters.tag,
        direction: filters.direction,
      });

      if (requestVersion === requestVersionRef.current) {
        dispatch({
          type: "filter/loaded",
          page,
        });
      }
    } catch (error) {
      if (requestVersion === requestVersionRef.current) {
        dispatch({ type: "request/failed" });
        showError(
          error instanceof Error ? error.message : "Не удалось обновить список",
        );
      }
    }
  }

  return filterArticles;
}
