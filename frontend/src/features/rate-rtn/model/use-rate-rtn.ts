"use client";

import { useState } from "react";
import { sendRtnReaction, useRtnReactions } from "@/entities/rtn";
import type { RtnReaction } from "@/entities/rtn";
import { useNotifications } from "@/shared/ui/notifications";
import type { RateRtnProps } from "./types";

/** Сохраняет оценку полезности разъяснения и сообщает об ошибке отправки. */
export function useRateRtn({ clarificationId, initial }: RateRtnProps) {
  const { reactions, updateReactions } = useRtnReactions(clarificationId, initial);
  const { showError } = useNotifications();
  const [isSending, setIsSending] = useState(false);

  /** Обновляет оценку и счётчики после успешного ответа сервера. */
  async function rate(value: RtnReaction) {
    if (isSending) {
      return;
    }

    setIsSending(true);

    try {
      const updatedReactions = await sendRtnReaction(clarificationId, value);
      updateReactions(updatedReactions);
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Не удалось сохранить оценку",
      );
    } finally {
      setIsSending(false);
    }
  }

  /** Отмечает разъяснение как полезное или снимает прежнюю положительную оценку. */
  function like() {
    void rate("LIKE");
  }

  /** Отмечает разъяснение как бесполезное или снимает прежнюю отрицательную оценку. */
  function dislike() {
    void rate("DISLIKE");
  }

  return {
    reactions,
    isSending,
    like,
    dislike,
  };
}
