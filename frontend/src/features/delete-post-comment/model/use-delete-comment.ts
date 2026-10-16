"use client";

import { useState } from "react";
import { deletePostComment } from "@/entities/post";
import { useNotifications } from "@/shared/ui/notifications";

/** Удаляет свой комментарий вместе с ответами после подтверждения. */
export function useDeleteComment(commentId: number, onDeleted: () => void) {
  const { showSuccess, showError } = useNotifications();
  const [isDeleting, setIsDeleting] = useState(false);

  /** Удаляет комментарий; при ошибке окно подтверждения остаётся открытым. */
  async function confirmDeletion() {
    setIsDeleting(true);

    try {
      await deletePostComment(commentId);
      showSuccess("Комментарий удалён");
      onDeleted();
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Не удалось удалить комментарий",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return {
    isDeleting,
    confirmDeletion,
  };
}
