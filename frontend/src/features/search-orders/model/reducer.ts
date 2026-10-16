import type { OrderSearchAction, OrderSearchState } from "./types";

/** Пустая поисковая форма без выбранного направления и открытых подсказок. */
export const INITIAL_ORDER_SEARCH_STATE: OrderSearchState = {
  query: "",
  badgeCode: "",
  filtersOpen: false,
  suggestionsOpen: false,
  activeSuggestion: -1,
};

/** Обновляет поля поиска и закрывает несовместимые панели при выборе действия. */
export function orderSearchReducer(
  state: OrderSearchState,
  action: OrderSearchAction,
): OrderSearchState {
  switch (action.type) {
    case "query/changed":
      return {
        ...state,
        query: action.value,
        activeSuggestion: -1,
        filtersOpen: false,
        suggestionsOpen: true,
      };
    case "filters/opened":
      return {
        ...state,
        filtersOpen: true,
        suggestionsOpen: false,
      };
    case "filters/closed":
      return {
        ...state,
        filtersOpen: false,
      };
    case "suggestions/opened":
      return {
        ...state,
        suggestionsOpen: true,
        filtersOpen: false,
      };
    case "suggestions/closed":
      return {
        ...state,
        suggestionsOpen: false,
      };
    case "filter/selected":
      return {
        ...state,
        badgeCode: action.code,
        filtersOpen: false,
        suggestionsOpen: false,
        activeSuggestion: -1,
      };
    case "filter/cleared":
      return {
        ...state,
        badgeCode: "",
        filtersOpen: false,
        suggestionsOpen: false,
        activeSuggestion: -1,
      };
    case "suggestion/highlighted":
      return {
        ...state,
        activeSuggestion: action.index,
      };
    case "panels/closed":
      return {
        ...state,
        filtersOpen: false,
        suggestionsOpen: false,
        activeSuggestion: -1,
      };
  }
}
