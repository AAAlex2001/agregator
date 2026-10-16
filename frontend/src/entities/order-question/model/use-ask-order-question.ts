"use client";

import { useNotifications } from "@/shared/ui/notifications";
import { askOrderQuestion } from "../api/ask-order-question";
import { useOrderQuestionsContext } from "./questions-provider";
import type { OrderQuestion } from "./types";

/** Отправляет новый вопрос и добавляет его подтверждённую версию в ветку. */
export function useAskOrderQuestion() {
  const { orderId, state, dispatch } = useOrderQuestionsContext();
  const { showError } = useNotifications();

  /** Возвращает созданный вопрос; при отказе сервера черновик остаётся у формы. */
  async function askQuestion(
    question: string,
    isAnonymous: boolean,
  ): Promise<OrderQuestion | null> {
    if (state.isSubmitting) {
      return null;
    }

    dispatch({
      type: "submit/started",
    });

    try {
      const createdQuestion = await askOrderQuestion(orderId, question, isAnonymous);

      dispatch({
        type: "question/added",
        question: createdQuestion,
      });
      return createdQuestion;
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось отправить");
      return null;
    } finally {
      dispatch({
        type: "submit/finished",
      });
    }
  }

  return askQuestion;
}
