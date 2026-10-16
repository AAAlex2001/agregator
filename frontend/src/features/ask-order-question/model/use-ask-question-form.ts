"use client";

import { useState } from "react";
import {
  useAskOrderQuestion,
  useOrderQuestions,
} from "@/entities/order-question";

/** Хранит новый вопрос и его видимость до подтверждённой отправки. */
export function useAskQuestionForm() {
  const [text, setText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const { isSubmitting } = useOrderQuestions();
  const askQuestion = useAskOrderQuestion();

  /** Очищает черновик только после создания вопроса на сервере. */
  async function submit() {
    const question = text.trim();

    if (!question || isSubmitting) {
      return;
    }

    const createdQuestion = await askQuestion(question, isAnonymous);

    if (createdQuestion) {
      setText("");
    }
  }

  return {
    text,
    isAnonymous,
    isSubmitting,
    changeText: setText,
    changeAnonymity: setIsAnonymous,
    submit,
  };
}
