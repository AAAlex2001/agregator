export type ChangeEmailStep = "closed" | "email" | "code";

export interface ChangeEmailState {
  step: ChangeEmailStep;
  email: string;
  code: string;
  error: string | null;
  isPending: boolean;
}

export type ChangeEmailAction =
  | { type: "modal/open" }
  | { type: "modal/close" }
  | { type: "email/change"; email: string }
  | { type: "code/change"; code: string }
  | { type: "request/start" }
  | { type: "request/codeSent" }
  | { type: "request/error"; error: string };
