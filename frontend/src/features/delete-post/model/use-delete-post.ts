"use client";

import { useState } from "react";
import { deletePost } from "@/entities/post";
import type { Post } from "@/entities/post";
import { useNotifications } from "@/shared/ui/notifications";

/** Удаляет свою публикацию или репост после подтверждения. */
export function useDeletePost(post: Post, onDeleted: () => void) {
  const { showSuccess, showError } = useNotifications();
  const [isDeleting, setIsDeleting] = useState(false);

  /** Удаляет запись; при ошибке окно подтверждения остаётся открытым. */
  async function confirmDeletion() {
    setIsDeleting(true);

    try {
      await deletePost(post.id);
      showSuccess(post.repost_of ? "Репост удалён" : "Публикация удалена");
      onDeleted();
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Не удалось удалить публикацию",
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
