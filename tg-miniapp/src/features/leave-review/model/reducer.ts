import type { LeaveReviewAction, LeaveReviewState } from "./types";

export const initialState: LeaveReviewState = { rating: 0, comment: "", busy: false };

export function reducer(state: LeaveReviewState, action: LeaveReviewAction): LeaveReviewState {
  switch (action.type) {
    case "reset":
      return initialState;
    case "rating":
      return { ...state, rating: action.value };
    case "comment":
      return { ...state, comment: action.value };
    case "busy":
      return { ...state, busy: action.value };
  }
}
