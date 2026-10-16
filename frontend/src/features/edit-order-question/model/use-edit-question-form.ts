"use client";

import { useState } from "react";
import {
  useOrderQuestions,
  useUpdateOrderQuestion,
} from "@/entities/order-question";
import type { OrderQuestion } from "@/entities/order-question";

/** Сохраняет текст вопроса автора и закрывает редактор после успешного ответа API. */
export function useEditQuestionForm(
  question: OrderQuestion,
  onSaved: () => void,
) {
  const [text, setText] = useState(question.question);
  const { isSubmitting } = useOrderQuestions();
  const updateQuestion = useUpdateOrderQuestion();

  /** При отказе сервера оставляет введённый текст для исправления или повтора. */
  async function submit() {
    const value = text.trim();

    if (!value || isSubmitting) {
      return;
    }

    const updatedQuestion = await updateQuestion(question.id, value);

    if (updatedQuestion) {
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
