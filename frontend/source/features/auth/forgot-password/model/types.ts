export type ForgotPasswordStep = "email" | "code" | "password" | "done";

export interface ForgotPasswordState {
  step: ForgotPasswordStep;
  email: string;
  code: string;
  password: string;
  repeatPassword: string;
  isSubmitting: boolean;
}

export type ForgotPasswordAction =
  | { type: "email/change"; email: string }
  | { type: "code/change"; code: string }
  | { type: "password/change"; password: string }
  | { type: "repeatPassword/change"; repeatPassword: string }
  | { type: "submit/start" }
  | { type: "submit/success"; step: ForgotPasswordStep }
  | { type: "submit/error" };
