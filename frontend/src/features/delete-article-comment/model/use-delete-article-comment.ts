"use client";

import { useState } from "react";
import { deleteArticleComment, useArticleComments } from "@/entities/article";
import { useNotifications } from "@/shared/ui/notifications";

/** Подтверждает удаление собственного комментария вместе с ответами. */
export function useDeleteArticleComment(commentId: number) {
  const { removeCommentBranch } = useArticleComments();
  const { showError } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  /** Открывает подтверждение удаления комментария. */
  function open() {
    setIsOpen(true);
  }

  /** Закрывает подтверждение, если удаление ещё не началось. */
  function close() {
    if (!isDeleting) {
      setIsOpen(false);
    }
  }

  /** Убирает ветку из обсуждения после подтверждения удаления сервером. */
  async function confirm() {
    if (isDeleting) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteArticleComment(commentId);
      removeCommentBranch(commentId);
      setIsOpen(false);
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Не удалось выполнить действие",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return {
    isOpen,
    isDeleting,
    open,
    close,
    confirm,
  };
}
