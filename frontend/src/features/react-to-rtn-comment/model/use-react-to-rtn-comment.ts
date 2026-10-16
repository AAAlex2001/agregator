"use client";

import { reactToRtnComment, useRtnComments } from "@/entities/rtn";
import type { RtnCommentReaction } from "@/entities/rtn";
import { useNotifications } from "@/shared/ui/notifications";

/** Сохраняет выбранную отметку и применяет счётчики, полученные от сервера. */
export function useReactToRtnComment(commentId: number) {
  const { updateCommentCounters } = useRtnComments();
  const { showError } = useNotifications();

  /** Отправляет отметку текущего участника обсуждения. */
  async function react(value: RtnCommentReaction) {
    try {
      const counters = await reactToRtnComment(commentId, value);

      updateCommentCounters(commentId, counters);
    } catch (error) {
      showError(
        error instanceof Error
          ? error.message
          : "Не удалось сохранить реакцию",
      );
    }
  }

  /** Отмечает практическую пользу комментария. */
  function markUseful() {
    void react("USEFUL");
  }

  /** Отмечает необходимость уточнения. */
  function requestClarification() {
    void react("CLARIFICATION");
  }

  /** Подтверждает согласие с описанной практикой. */
  function agree() {
    void react("AGREE");
  }

  return {
    markUseful,
    requestClarification,
    agree,
  };
}
