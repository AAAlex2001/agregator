"use client";

import { useState } from "react";
import { subscribeToRtnQuestion } from "@/source/entities/rtn";
import { useNotifications } from "@/source/shared/ui/Notifications";

/** Подписка на ответ: почта и отправка. */
export function useSubscribe(questionId: number, onSubscribed: () => void) {
  const { showError, showSuccess } = useNotifications();
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  const subscribe = async () => {
    const value = email.trim();
    if (!value) return;
    setIsSending(true);
    try {
      await subscribeToRtnQuestion(questionId, value);
      showSuccess("Пришлём письмо, когда ответ будет опубликован");
      onSubscribed();
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось оформить подписку");
    } finally {
      setIsSending(false);
    }
  };

  return { email, setEmail, isSending, subscribe };
}
