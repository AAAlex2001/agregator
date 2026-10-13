"use client";

import { useState, type FormEvent } from "react";
import { submitRtnQuestion } from "@/source/entities/rtn";
import { useNotifications } from "@/source/shared/ui/Notifications";

/** Текст вопроса и его отправка; после успеха поле очищается. */
export function useAskQuestion(onSent: () => void) {
  const { showError, showSuccess } = useNotifications();
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const value = text.trim();
    if (!value) {
      showError("Опишите ваш вопрос");
      return;
    }
    setIsSending(true);
    try {
      await submitRtnQuestion(value);
      setText("");
      showSuccess("Вопрос отправлен");
      onSent();
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось отправить вопрос");
    } finally {
      setIsSending(false);
    }
  };

  return { text, setText, isSending, submit };
}
