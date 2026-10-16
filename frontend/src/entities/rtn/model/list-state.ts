import type { RtnList, RtnListItem } from "./types";

/** Показанные разъяснения и состояние загрузки следующей части каталога. */
export interface RtnListState {
  items: RtnListItem[];
  hasMore: boolean;
  isLoading: boolean;
}

/** Результаты загрузки следующей страницы каталога. */
export type RtnListAction =
  | { type: "more/started" }
  | { type: "more/loaded"; page: RtnList }
  | { type: "more/failed" };

/** Использует серверную выдачу для первого отображения каталога. */
export function createRtnListState(page: RtnList): RtnListState {
  return {
    items: page.items,
    hasMore: page.has_more,
    isLoading: false,
  };
}

/** Добавляет загруженные разъяснения, сохраняя список при ошибке запроса. */
export function rtnListReducer(
  state: RtnListState,
  action: RtnListAction,
): RtnListState {
  switch (action.type) {
    case "more/started":
      return {
        ...state,
        isLoading: true,
      };
    case "more/loaded":
      return {
        items: [...state.items, ...action.page.items],
        hasMore: action.page.has_more,
        isLoading: false,
      };
    case "more/failed":
      return {
        ...state,
        isLoading: false,
      };
  }
}
