import { useReducer, type FormEvent } from "react";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { submitRtnQuestion } from "../api/rtnFeedback.api";
import {
  initialRtnQuestionFormState,
  rtnQuestionFormReducer,
} from "./rtnQuestionForm.reducer";

export function useRtnQuestionSubmit(onSubmitted: () => void) {
  const { showError, showSuccess } = useNotifications();
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
      showError("Опишите ваш вопрос");
      return;
    }

    dispatch({ type: "submit" });
    try {
      await submitRtnQuestion(value, "");
      dispatch({ type: "success" });
      showSuccess("Вопрос отправлен");
      onSubmitted();
    } catch (submitError) {
      dispatch({ type: "error" });
      showError(
        submitError instanceof Error
          ? submitError.message
          : "Не удалось отправить вопрос",
      );
    }
  };

  return { ...state, changeQuestion, submit };
}
