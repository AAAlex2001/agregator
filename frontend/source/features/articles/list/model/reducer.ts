import type { ArticlesListAction, ArticlesListState } from "./types";

export function articlesListReducer(state: ArticlesListState, action: ArticlesListAction): ArticlesListState {
  switch (action.type) {
    case "filter/start":
      return { ...state, tag: action.tag, direction: action.direction, isReloading: true };
    case "filter/success":
      return { ...state, items: action.items, hasMore: action.hasMore, offset: action.items.length, isReloading: false };
    case "filter/error":
      return { ...state, isReloading: false };
    case "more/start":
      return { ...state, isLoadingMore: true };
    case "more/success":
      return {
        ...state,
        items: [...state.items, ...action.items],
        hasMore: action.hasMore,
        offset: state.offset + action.items.length,
      };
    case "more/finish":
      return { ...state, isLoadingMore: false };
  }
}
