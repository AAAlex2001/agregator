import type { ArticleListItem, ArticleListPage } from "./types";

/** Выбранные тег и направление в списке статей. */
export interface ArticleFilters {
  tag: string;
  direction: string;
}

/** Первая серверная страница и её смещение в полном списке. */
export interface ArticleListInitialData {
  page: ArticleListPage;
  offset: number;
}

/** Загруженные статьи, текущие фильтры и состояние запроса. */
export interface ArticleListState {
  items: ArticleListItem[];
  hasMore: boolean;
  offset: number;
  filters: ArticleFilters;
  operation: "idle" | "filtering" | "loading-more";
}

/** Результаты фильтрации и последовательной загрузки статей. */
export type ArticleListAction =
  | {
      type: "filter/started";
      filters: ArticleFilters;
    }
  | {
      type: "filter/loaded";
      page: ArticleListPage;
    }
  | {
      type: "more/started";
    }
  | {
      type: "more/loaded";
      page: ArticleListPage;
    }
  | {
      type: "request/failed";
    };

/** Использует серверные статьи без повторного запроса при открытии страницы. */
export function createArticleListState({
  page,
  offset,
}: ArticleListInitialData): ArticleListState {
  return {
    items: page.items,
    hasMore: page.has_more,
    offset: offset + page.items.length,
    filters: {
      tag: "",
      direction: "",
    },
    operation: "idle",
  };
}

/** Применяет страницы API; ошибка оставляет ранее загруженные статьи на экране. */
export function articleListReducer(
  state: ArticleListState,
  action: ArticleListAction,
): ArticleListState {
  switch (action.type) {
    case "filter/started":
      return {
        ...state,
        filters: action.filters,
        operation: "filtering",
      };

    case "filter/loaded":
      return {
        ...state,
        items: action.page.items,
        hasMore: action.page.has_more,
        offset: action.page.items.length,
        operation: "idle",
      };

    case "more/started":
      return {
        ...state,
        operation: "loading-more",
      };

    case "more/loaded":
      return {
        ...state,
        items: [...state.items, ...action.page.items],
        hasMore: action.page.has_more,
        offset: state.offset + action.page.items.length,
        operation: "idle",
      };

    case "request/failed":
      return {
        ...state,
        operation: "idle",
      };
  }
}
