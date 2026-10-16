"use client";

import { createContext, useContext } from "react";
import type { Dispatch, RefObject } from "react";
import type { ArticleListAction, ArticleListState } from "./list-state";
import type { ArticleKind } from "./types";

/** Данные одного списка и доступ операций к его состоянию. */
interface ArticleListContextValue {
  kind: ArticleKind;
  availableTags: string[];
  state: ArticleListState;
  dispatch: Dispatch<ArticleListAction>;
  requestVersionRef: RefObject<number>;
}

export const ArticleListContext = createContext<ArticleListContextValue | null>(null);

/** Передаёт операциям списка его данные и редьюсер. */
export function useArticleListContext() {
  const context = useContext(ArticleListContext);

  if (!context) {
    throw new Error("Список статей должен находиться внутри ArticleListProvider");
  }

  return context;
}

/** Возвращает статьи, фильтры и варианты тегов из первой серверной страницы. */
export function useArticleList() {
  const { kind, availableTags, state } = useArticleListContext();

  return {
    ...state,
    kind,
    availableTags,
  };
}
