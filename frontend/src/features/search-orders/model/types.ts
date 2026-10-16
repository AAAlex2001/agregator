/** Введённый запрос, код требований и открытые части поисковой формы. */
export interface OrderSearchState {
  query: string;
  badgeCode: string;
  filtersOpen: boolean;
  suggestionsOpen: boolean;
  activeSuggestion: number;
}

/** Действия пользователя, изменяющие поиск и выделение подсказок. */
export type OrderSearchAction =
  | { type: "query/changed"; value: string }
  | { type: "filters/opened" }
  | { type: "filters/closed" }
  | { type: "suggestions/opened" }
  | { type: "suggestions/closed" }
  | { type: "filter/selected"; code: string }
  | { type: "filter/cleared" }
  | { type: "suggestion/highlighted"; index: number }
  | { type: "panels/closed" };
