import type { TechExpertAction, TechExpertState } from "./types";

export const initialState: TechExpertState = {
  query: "",
  tips: [],
  tipsOpen: false,
  results: null,
  searching: false,
  error: null,
  detail: null,
  detailLoading: false,
};

export function reducer(state: TechExpertState, action: TechExpertAction): TechExpertState {
  switch (action.type) {
    case "query":
      return { ...state, query: action.value };
    case "tips":
      return { ...state, tips: action.tips, tipsOpen: action.tips.length > 0 };
    case "tipsOpen":
      return { ...state, tipsOpen: action.value };
    case "searchStart":
      return { ...state, searching: true, error: null, tipsOpen: false };
    case "searchSuccess":
      return { ...state, searching: false, results: action.results };
    case "searchError":
      return { ...state, searching: false, results: null, error: action.error };
    case "detailStart":
      return { ...state, detailLoading: true, error: null };
    case "detailSuccess":
      return { ...state, detailLoading: false, detail: action.detail };
    case "detailError":
      return { ...state, detailLoading: false, error: action.error };
    case "detailClose":
      return { ...state, detail: null };
    case "reset":
      return initialState;
    default:
      return state;
  }
}
