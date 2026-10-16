"use client";

import { useState } from "react";
import {
  useAnswerOrderQuestion,
  useOrderQuestions,
} from "@/entities/order-question";
import type { OrderQuestion } from "@/entities/order-question";

/** Хранит новый или редактируемый ответ заказчика до его сохранения. */
export function useAnswerQuestionForm(
  question: OrderQuestion,
  onSaved: () => void,
) {
  const [text, setText] = useState(question.answer ?? "");
  const { isSubmitting } = useOrderQuestions();
  const answerQuestion = useAnswerOrderQuestion();

  /** Подтверждает ответ и оставляет редактор открытым, если запрос не удался. */
  async function submit() {
    const answer = text.trim();

    if (!answer || isSubmitting) {
      return;
    }

    const answeredQuestion = await answerQuestion(question.id, answer);

    if (answeredQuestion) {
      onSaved();
    }
  }

  return {
    text,
    isSubmitting,
    changeText: setText,
    submit,
  };
}
