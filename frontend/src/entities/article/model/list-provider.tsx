"use client";

import { useReducer, useRef } from "react";
import type { ReactNode } from "react";
import { ArticleListContext } from "./list-context";
import { articleListReducer, createArticleListState } from "./list-state";
import type { ArticleKind, ArticleListPage } from "./types";

/** Серверные данные одного раздела и компоненты его списка. */
interface ArticleListProviderProps {
  kind: ArticleKind;
  initialPage: ArticleListPage;
  initialOffset?: number;
  children: ReactNode;
}

/** Хранит список для фильтров и догрузки, сохраняя первую страницу в серверном HTML. */
export function ArticleListProvider({
  kind,
  initialPage,
  initialOffset = 0,
  children,
}: ArticleListProviderProps) {
  const [state, dispatch] = useReducer(
    articleListReducer,
    {
      page: initialPage,
      offset: initialOffset,
    },
    createArticleListState,
  );
  const requestVersionRef = useRef(0);
  const availableTags = [
    ...new Set(initialPage.items.flatMap((article) => article.tags)),
  ];

  return (
    <ArticleListContext.Provider
      value={{
        kind,
        availableTags,
        state,
        dispatch,
        requestVersionRef,
      }}
    >
      {children}
    </ArticleListContext.Provider>
  );
}
