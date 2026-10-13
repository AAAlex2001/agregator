export interface ConfirmEmailState {
  code: string;
  isSubmitting: boolean;
  isResending: boolean;
}

export type ConfirmEmailAction =
  | { type: "code/change"; code: string }
  | { type: "submit/start" }
  | { type: "submit/error" }
  | { type: "resend/start" }
  | { type: "resend/finish" };
