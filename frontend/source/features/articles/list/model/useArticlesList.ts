"use client";

import { useReducer } from "react";
import { BLOG_PAGE_SIZE, fetchArticleList, type ArticleKind, type ArticleList } from "@/source/entities/article";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { articlesListReducer } from "./reducer";

/** Список статей: первая страница приходит с сервера, фильтры и «показать ещё» догружают с клиента. */
export function useArticlesList(kind: ArticleKind, initial: ArticleList, initialOffset: number) {
  const { showError } = useNotifications();
  const [state, dispatch] = useReducer(articlesListReducer, {
    items: initial.items,
    hasMore: initial.has_more,
    offset: initialOffset + initial.items.length,
    tag: "",
    direction: "",
    isReloading: false,
    isLoadingMore: false,
  });

  const filter = async (tag: string, direction: string) => {
    dispatch({ type: "filter/start", tag, direction });
    try {
      const page = await fetchArticleList({ kind, limit: BLOG_PAGE_SIZE, offset: 0, tag, direction });
      dispatch({ type: "filter/success", items: page.items, hasMore: page.has_more });
    } catch (error) {
      dispatch({ type: "filter/error" });
      showError(error instanceof Error ? error.message : "Не удалось обновить список");
    }
  };

  const loadMore = async () => {
    if (!state.hasMore || state.isLoadingMore || state.isReloading) return;
    dispatch({ type: "more/start" });
    try {
      const page = await fetchArticleList({
        kind,
        limit: BLOG_PAGE_SIZE,
        offset: state.offset,
        tag: state.tag,
        direction: state.direction,
      });
      dispatch({ type: "more/success", items: page.items, hasMore: page.has_more });
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось подгрузить");
    } finally {
      dispatch({ type: "more/finish" });
    }
  };

  return {
    state,
    changeTag: (tag: string) => filter(tag, state.direction),
    changeDirection: (direction: string) => filter(state.tag, direction),
    loadMore,
  };
}
