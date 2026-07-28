import { useReducer, type FormEvent } from "react";
import { submitRtnQuestion } from "../api/rtnFeedback.api";
import {
  initialRtnQuestionFormState,
  rtnQuestionFormReducer,
} from "./rtnQuestionForm.reducer";

export function useRtnQuestionSubmit(onSubmitted: () => void) {
  const [state, dispatch] = useReducer(
    rtnQuestionFormReducer,
    initialRtnQuestionFormState,
  );

  const changeQuestion = (value: string) => {
    dispatch({ type: "change", value });
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const value = state.questionText.trim();
    if (!value) {
      dispatch({ type: "error", message: "Опишите ваш вопрос" });
      return;
    }

    dispatch({ type: "submit" });
    try {
      await submitRtnQuestion(value, "");
      dispatch({ type: "success" });
      onSubmitted();
    } catch (submitError) {
      dispatch({
        type: "error",
        message: submitError instanceof Error
          ? submitError.message
          : "Не удалось отправить вопрос",
      });
    }
  };

  return { ...state, changeQuestion, submit };
}
