export type ResetPasswordStep = "email" | "code" | "password" | "done";

export interface ResetPasswordState {
  step: ResetPasswordStep;
  email: string;
  code: string;
  password: string;
  repeatPassword: string;
  isSubmitting: boolean;
}

export type ResetPasswordAction =
  | { type: "email/changed"; email: string }
  | { type: "code/changed"; code: string }
  | { type: "password/changed"; password: string }
  | { type: "password-repeat/changed"; password: string }
  | { type: "request/started" }
  | { type: "request/failed" }
  | { type: "email/sent" }
  | { type: "code/confirmed" }
  | { type: "password/saved" };
