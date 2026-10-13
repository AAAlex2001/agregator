import type { ReferralAction, ReferralState } from "./types";

export const INITIAL_STATE: ReferralState = { overview: null, error: null, isLoading: true, attempt: 0 };

export function referralReducer(state: ReferralState, action: ReferralAction): ReferralState {
  switch (action.type) {
    case "load/retry":
      return { ...state, isLoading: true, error: null, attempt: state.attempt + 1 };
    case "load/success":
      return { ...state, overview: action.overview, isLoading: false, error: null };
    case "load/error":
      return { ...state, isLoading: false, error: action.error };
  }
}
