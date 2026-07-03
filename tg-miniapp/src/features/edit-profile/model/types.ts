export type EditProfileKind = "name" | "phone" | "email";

export type EmailStage = "email" | "code";

export interface EditProfileState {
  first: string;
  last: string;
  phone: string;
  email: string;
  code: string;
  stage: EmailStage;
  busy: boolean;
  done: boolean;
}

export type EditProfileAction =
  | { type: "init"; first: string; last: string; phone: string }
  | { type: "first"; value: string }
  | { type: "last"; value: string }
  | { type: "phone"; value: string }
  | { type: "email"; value: string }
  | { type: "code"; value: string }
  | { type: "stage"; stage: EmailStage }
  | { type: "busy"; value: boolean }
  | { type: "done" };
