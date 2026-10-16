"use client";

import { useState } from "react";
import { sendArticleReaction, useArticleReactions } from "@/entities/article";
import type { ArticleReaction } from "@/entities/article";
import { useNotifications } from "@/shared/ui/notifications";
import type { RateArticleProps } from "./types";

/** Сохраняет оценку полезности статьи и сообщает об ошибке отправки. */
export function useRateArticle({ articleId, initial }: RateArticleProps) {
  const { reactions, updateReactions } = useArticleReactions(articleId, initial);
  const { showError } = useNotifications();
  const [isSending, setIsSending] = useState(false);

  /** Обновляет счётчики только после успешного ответа сервера. */
  async function rate(value: ArticleReaction) {
    if (isSending) {
      return;
    }

    setIsSending(true);

    try {
      const updatedReactions = await sendArticleReaction(articleId, value);
      updateReactions(updatedReactions);
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Не удалось сохранить оценку",
      );
    } finally {
      setIsSending(false);
    }
  }

  /** Отмечает статью как полезную или снимает прежнюю положительную оценку. */
  function like() {
    void rate("LIKE");
  }

  /** Отмечает статью как бесполезную или снимает прежнюю отрицательную оценку. */
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
