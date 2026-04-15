import type { FinanceState, FinanceAction } from "./types";

export function createInitialFinanceState(balance: number): FinanceState {
  return {
    balance,
    payments: [],
    depositOpen: false,
    depositAmount: "",
    depositLoading: false,
    withdrawOpen: false,
    withdrawAmount: "",
    withdrawCard: "",
    withdrawLoading: false,
    error: null,
    success: null,
  };
}

export function financeReducer(state: FinanceState, action: FinanceAction): FinanceState {
  switch (action.type) {
    case "SET_BALANCE":
      return { ...state, balance: action.balance };
    case "SET_PAYMENTS":
      return { ...state, payments: action.payments };

    case "OPEN_DEPOSIT":
      return { ...state, depositOpen: true, depositAmount: "", error: null, success: null };
    case "CLOSE_DEPOSIT":
      return { ...state, depositOpen: false };
    case "SET_DEPOSIT_AMOUNT":
      return { ...state, depositAmount: action.value };
    case "SET_DEPOSIT_LOADING":
      return { ...state, depositLoading: action.value };

    case "OPEN_WITHDRAW":
      return { ...state, withdrawOpen: true, withdrawAmount: "", withdrawCard: "", error: null, success: null };
    case "CLOSE_WITHDRAW":
      return { ...state, withdrawOpen: false };
    case "SET_WITHDRAW_AMOUNT":
      return { ...state, withdrawAmount: action.value };
    case "SET_WITHDRAW_CARD":
      return { ...state, withdrawCard: action.value };
    case "SET_WITHDRAW_LOADING":
      return { ...state, withdrawLoading: action.value };

    case "SET_ERROR":
      return { ...state, error: action.error };
    case "SET_SUCCESS":
      return { ...state, success: action.message };
    default:
      return state;
  }
}
