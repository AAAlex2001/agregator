"use client";

import { useNotifications } from "@/shared/ui/notifications";
import { updateOrderQuestion } from "../api/update-order-question";
import { useOrderQuestionsContext } from "./questions-provider";
import type { OrderQuestion } from "./types";

/** Сохраняет редакцию вопроса автора до появления ответа заказчика. */
export function useUpdateOrderQuestion() {
  const { state, dispatch } = useOrderQuestionsContext();
  const { showError } = useNotifications();

  /** Заменяет вопрос в ветке только после подтверждения сервера. */
  async function updateQuestion(
    questionId: number,
    question: string,
  ): Promise<OrderQuestion | null> {
    if (state.isSubmitting) {
      return null;
    }

    dispatch({
      type: "submit/started",
    });

    try {
      const updatedQuestion = await updateOrderQuestion(questionId, question);

      dispatch({
        type: "question/updated",
        question: updatedQuestion,
      });
      return updatedQuestion;
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось отправить");
      return null;
    } finally {
      dispatch({
        type: "submit/finished",
      });
    }
  }

  return updateQuestion;
}
