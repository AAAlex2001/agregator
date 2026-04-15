import type { PaymentItem } from "@/source/entities/payment";

export interface FinanceState {
  balance: number;
  payments: PaymentItem[];

  depositOpen: boolean;
  depositAmount: string;
  depositLoading: boolean;

  withdrawOpen: boolean;
  withdrawAmount: string;
  withdrawCard: string;
  withdrawLoading: boolean;

  error: string | null;
  success: string | null;
}

export type FinanceAction =
  | { type: "SET_BALANCE"; balance: number }
  | { type: "SET_PAYMENTS"; payments: PaymentItem[] }
  | { type: "OPEN_DEPOSIT" }
  | { type: "CLOSE_DEPOSIT" }
  | { type: "SET_DEPOSIT_AMOUNT"; value: string }
  | { type: "SET_DEPOSIT_LOADING"; value: boolean }
  | { type: "OPEN_WITHDRAW" }
  | { type: "CLOSE_WITHDRAW" }
  | { type: "SET_WITHDRAW_AMOUNT"; value: string }
  | { type: "SET_WITHDRAW_CARD"; value: string }
  | { type: "SET_WITHDRAW_LOADING"; value: boolean }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "SET_SUCCESS"; message: string | null };
