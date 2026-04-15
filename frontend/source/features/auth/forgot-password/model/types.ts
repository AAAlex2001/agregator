export type ForgotPasswordStep = 1 | 2 | 3 | 4;

export interface ForgotPasswordState {
  step: ForgotPasswordStep;
  email: string;
  code: string;
  password: string;
  repeatPassword: string;
  isLoading: boolean;
  error: string | null;
}

type ForgotPasswordField = "email" | "code" | "password" | "repeatPassword";

export type ForgotPasswordAction =
  | { type: "SET_STEP"; payload: ForgotPasswordStep }
  | { type: "SET_FIELD"; field: ForgotPasswordField; value: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };
