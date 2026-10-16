"use client";

import { useState } from "react";
import { subscribeToRtnQuestion } from "@/entities/rtn";
import { useNotifications } from "@/shared/ui/notifications";

/** Отправляет почту для уведомления об официальном ответе на обращение. */
export function useSubscribeToRtnQuestion(
  questionId: number,
  onSubscribed: () => void,
) {
  const { showError, showSuccess } = useNotifications();
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  /** Подписывает указанный адрес и сообщает карточке об успехе. */
  async function subscribe() {
    const address = email.trim();

    if (!address || isSending) {
      return;
    }

    setIsSending(true);

    try {
      await subscribeToRtnQuestion(questionId, address);
      showSuccess("Пришлём письмо, когда ответ будет опубликован");
      onSubscribed();
    } catch (error) {
      showError(
        error instanceof Error
          ? error.message
          : "Не удалось оформить подписку",
      );
    } finally {
      setIsSending(false);
    }
  }

  return {
    email,
    setEmail,
    isSending,
    subscribe,
  };
}
