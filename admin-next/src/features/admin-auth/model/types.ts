export type LoginState = {
  login: string;
  password: string;
  pending: boolean;
};

export type LoginAction =
  | { type: "field/change"; field: "login" | "password"; value: string }
  | { type: "submit/start" }
  | { type: "submit/error" };

export type SessionState = {
  ready: boolean;
};

export type SessionAction = { type: "session/confirmed" };
