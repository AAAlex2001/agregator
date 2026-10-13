export interface SearchBarState {
  query: string;
  badgeCode: string;
  filterLabel: string;
  filtersOpen: boolean;
  suggestionsOpen: boolean;
  activeSuggestion: number;
}

export const initialSearchBarState: SearchBarState = {
  query: "",
  badgeCode: "",
  filterLabel: "",
  filtersOpen: false,
  suggestionsOpen: false,
  activeSuggestion: -1,
};

export type SearchBarAction =
  | { type: "queryChanged"; value: string }
  | { type: "filtersOpened" }
  | { type: "filtersClosed" }
  | { type: "suggestionsOpened" }
  | { type: "suggestionsClosed" }
  | { type: "filterSelected"; badgeCode: string; label: string }
  | { type: "filterCleared" }
  | { type: "suggestionHighlighted"; index: number }
  | { type: "closed" };

export function searchBarReducer(state: SearchBarState, action: SearchBarAction): SearchBarState {
  switch (action.type) {
    case "queryChanged":
      return {
        ...state,
        query: action.value,
        activeSuggestion: -1,
        filtersOpen: false,
        suggestionsOpen: true,
      };
    case "filtersOpened":
      return { ...state, filtersOpen: true, suggestionsOpen: false };
    case "filtersClosed":
      return { ...state, filtersOpen: false };
    case "suggestionsOpened":
      return { ...state, suggestionsOpen: true, filtersOpen: false };
    case "suggestionsClosed":
      return { ...state, suggestionsOpen: false };
    case "filterSelected":
      return {
        ...state,
        badgeCode: action.badgeCode,
        filterLabel: action.label,
        filtersOpen: false,
        suggestionsOpen: false,
        activeSuggestion: -1,
      };
    case "filterCleared":
      return {
        ...state,
        badgeCode: "",
        filterLabel: "",
        filtersOpen: false,
        suggestionsOpen: false,
        activeSuggestion: -1,
      };
    case "suggestionHighlighted":
      return { ...state, activeSuggestion: action.index };
    case "closed":
      return { ...state, filtersOpen: false, suggestionsOpen: false, activeSuggestion: -1 };
  }
}
