export interface RtnQuestionFormState {
  questionText: string;
  busy: boolean;
}

export type RtnQuestionFormAction =
  | { type: "change"; value: string }
  | { type: "submit" }
  | { type: "success" }
  | { type: "error" };

export const initialRtnQuestionFormState: RtnQuestionFormState = {
  questionText: "",
  busy: false,
};

export function rtnQuestionFormReducer(
  state: RtnQuestionFormState,
  action: RtnQuestionFormAction,
): RtnQuestionFormState {
  switch (action.type) {
    case "change":
      return { ...state, questionText: action.value };
    case "submit":
      return { ...state, busy: true };
    case "success":
      return { ...state, questionText: "", busy: false };
    case "error":
      return { ...state, busy: false };
  }
}
