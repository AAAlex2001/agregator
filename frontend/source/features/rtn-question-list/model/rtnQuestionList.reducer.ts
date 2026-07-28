import type { RtnQuestion } from "@/source/entities/rtn-question";

export interface RtnQuestionListState {
  questions: RtnQuestion[];
  loading: boolean;
  error: string;
  retryVersion: number;
}

export type RtnQuestionListAction =
  | { type: "load" }
  | { type: "success"; questions: RtnQuestion[] }
  | { type: "error"; message: string }
  | { type: "retry" };

export const initialRtnQuestionListState: RtnQuestionListState = {
  questions: [],
  loading: true,
  error: "",
  retryVersion: 0,
};

export function rtnQuestionListReducer(
  state: RtnQuestionListState,
  action: RtnQuestionListAction,
): RtnQuestionListState {
  switch (action.type) {
    case "load":
      return { ...state, loading: true, error: "" };
    case "success":
      return { ...state, questions: action.questions, loading: false, error: "" };
    case "error":
      return { ...state, loading: false, error: action.message };
    case "retry":
      return { ...state, retryVersion: state.retryVersion + 1 };
  }
}
