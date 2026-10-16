import type { ConfirmEmailAction, ConfirmEmailState } from "./types";

/** Пустой код перед первым подтверждением почты. */
export const INITIAL_CONFIRM_EMAIL_STATE: ConfirmEmailState = {
  code: "",
  isSubmitting: false,
};

/** Хранит поле кода и занятость формы без состояния запросов сущности. */
export function confirmEmailReducer(
  state: ConfirmEmailState,
  action: ConfirmEmailAction,
): ConfirmEmailState {
  switch (action.type) {
    case "code/changed":
      return {
        ...state,
        code: action.code,
      };
    case "confirmation/started":
      return {
        ...state,
        isSubmitting: true,
      };
    case "confirmation/finished":
      return {
        ...state,
        isSubmitting: false,
      };
  }
}
