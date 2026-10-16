"use client";

import { useState } from "react";
import { deleteRtnComment, useRtnComments } from "@/entities/rtn";
import { useNotifications } from "@/shared/ui/notifications";

/** Подтверждает удаление своего комментария и обновляет обсуждение после ответа API. */
export function useDeleteRtnComment(commentId: number) {
  const { removeCommentBranch } = useRtnComments();
  const { showError } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  /** Открывает подтверждение удаления ветки обсуждения. */
  function open() {
    setIsOpen(true);
  }

  /** Закрывает окно по кнопке отмены, как в исходном подтверждении. */
  function close() {
    setIsOpen(false);
  }

  /** Удаляет комментарий и его ответы после подтверждения сервером. */
  async function confirm() {
    if (isDeleting) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteRtnComment(commentId);
      removeCommentBranch(commentId);
      setIsOpen(false);
    } catch (error) {
      showError(
        error instanceof Error
          ? error.message
          : "Не удалось удалить комментарий",
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
