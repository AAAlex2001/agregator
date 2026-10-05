import type { ReferralAction, ReferralState } from "./types";

export const initialReferralState: ReferralState = {
  overview: null,
  error: null,
  isLoading: true,
  requestNumber: 0,
};

/** Обновляет данные и состояние загрузки реферального кабинета. */
export function referralReducer(state: ReferralState, action: ReferralAction): ReferralState {
  switch (action.type) {
    case "LOAD_REQUESTED":
      return { ...state, isLoading: true, error: null, requestNumber: state.requestNumber + 1 };
    case "LOAD_SUCCEEDED":
      return { ...state, overview: action.overview, isLoading: false, error: null };
    case "LOAD_FAILED":
      return { ...state, isLoading: false, error: action.error };
  }
}
