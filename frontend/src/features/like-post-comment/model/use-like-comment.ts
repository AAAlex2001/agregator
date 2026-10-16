"use client";

import { useState } from "react";
import { togglePostCommentLike } from "@/entities/post";
import type { PostComment } from "@/entities/post";
import { useUser } from "@/entities/user";
import { useNotifications } from "@/shared/ui/notifications";

/** Лайк комментария; гостю вместо лайка открывает вход. */
export function useLikeComment(comment: PostComment, onLogin: () => void) {
  const { user } = useUser();
  const { showError } = useNotifications();
  const [liked, setLiked] = useState(comment.liked);
  const [likes, setLikes] = useState(comment.likes_count);
  const [isSending, setIsSending] = useState(false);

  /** Ставит или убирает лайк и показывает счётчик из ответа сервера. */
  async function toggleLike() {
    if (!user) {
      onLogin();
      return;
    }

    setIsSending(true);

    try {
      const result = await togglePostCommentLike(comment.id, !liked);

      setLiked(result.liked);
      setLikes(result.likes_count);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось изменить лайк");
    } finally {
      setIsSending(false);
    }
  }

  return {
    liked,
    likes,
    isSending,
    toggleLike,
  };
}
