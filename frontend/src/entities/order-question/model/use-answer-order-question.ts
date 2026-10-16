"use client";

import { useNotifications } from "@/shared/ui/notifications";
import { answerOrderQuestion } from "../api/answer-order-question";
import { useOrderQuestionsContext } from "./questions-provider";
import type { OrderQuestion } from "./types";

/** Сохраняет ответ заказчика и обновляет вопрос в текущей ветке. */
export function useAnswerOrderQuestion() {
  const { state, dispatch } = useOrderQuestionsContext();
  const { showError } = useNotifications();

  /** Возвращает вопрос с ответом, чтобы форма закрылась только после успеха. */
  async function answerQuestion(
    questionId: number,
    answer: string,
  ): Promise<OrderQuestion | null> {
    if (state.isSubmitting) {
      return null;
    }

    dispatch({
      type: "submit/started",
    });

    try {
      const answeredQuestion = await answerOrderQuestion(questionId, answer);

      dispatch({
        type: "question/updated",
        question: answeredQuestion,
      });
      return answeredQuestion;
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось отправить");
      return null;
    } finally {
      dispatch({
        type: "submit/finished",
      });
    }
  }

  return answerQuestion;
}
