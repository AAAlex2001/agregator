"use client";

import { useState } from "react";
import { submitRtnQuestion } from "@/entities/rtn";
import { useNotifications } from "@/shared/ui/notifications";

/** Отправляет обращение в Ростехнадзор и очищает текст после успеха. */
export function useAskRtnQuestion(onSent: () => void) {
  const { showError, showSuccess } = useNotifications();
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);

  /** Проверяет заполненность вопроса и передаёт его серверу. */
  async function submit() {
    if (isSending) {
      return;
    }

    const question = text.trim();

    if (!question) {
      showError("Опишите ваш вопрос");
      return;
    }

    setIsSending(true);

    try {
      await submitRtnQuestion(question);
      setText("");
      showSuccess("Вопрос отправлен");
      onSent();
    } catch (error) {
      showError(
        error instanceof Error
          ? error.message
          : "Не удалось отправить вопрос",
      );
    } finally {
      setIsSending(false);
    }
  }

  return {
    text,
    setText,
    isSending,
    submit,
  };
}
