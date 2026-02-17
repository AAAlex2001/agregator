import { useReducer } from "react";
import type { ResponseCardViewModel, ResponseCounters, ResponsesState } from "./types";

type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_ITEMS"; payload: ResponseCardViewModel[] }
  | { type: "SET_COUNTERS"; payload: ResponseCounters }
  | { type: "RESET" };

const initialState: ResponsesState = {
  items: [],
  counters: {
    all: 0,
    review: 0,
    rejected: 0,
    accepted: 0,
    completed: 0,
    archive: 0,
  },
  isLoading: false,
  error: null,
};

function reducer(state: ResponsesState, action: Action): ResponsesState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_ITEMS":
      return { ...state, items: action.payload };
    case "SET_COUNTERS":
      return { ...state, counters: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export function useResponsesState(): ResponsesState & {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setItems: (items: ResponseCardViewModel[]) => void;
  setCounters: (counters: ResponseCounters) => void;
  reset: () => void;
} {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setLoading = (loading: boolean) => dispatch({ type: "SET_LOADING", payload: loading });
  const setError = (error: string | null) => dispatch({ type: "SET_ERROR", payload: error });
  const setItems = (items: ResponseCardViewModel[]) => dispatch({ type: "SET_ITEMS", payload: items });
  const setCounters = (counters: ResponseCounters) => dispatch({ type: "SET_COUNTERS", payload: counters });
  const reset = () => dispatch({ type: "RESET" });

  return {
    ...state,
    setLoading,
    setError,
    setItems,
    setCounters,
    reset,
  };
}
