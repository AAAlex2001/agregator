export interface RtnQuestionFormState {
  questionText: string;
  busy: boolean;
  error: string;
  sent: boolean;
}

export type RtnQuestionFormAction =
  | { type: "change"; value: string }
  | { type: "submit" }
  | { type: "success" }
  | { type: "error"; message: string };

export const initialRtnQuestionFormState: RtnQuestionFormState = {
  questionText: "",
  busy: false,
  error: "",
  sent: false,
};

export function rtnQuestionFormReducer(
  state: RtnQuestionFormState,
  action: RtnQuestionFormAction,
): RtnQuestionFormState {
  switch (action.type) {
    case "change":
      return { ...state, questionText: action.value, error: "", sent: false };
    case "submit":
      return { ...state, busy: true, error: "", sent: false };
    case "success":
      return { ...state, questionText: "", busy: false, sent: true };
    case "error":
      return { ...state, busy: false, error: action.message };
  }
}
