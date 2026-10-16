"use client";

import { useState } from "react";
import { togglePostLike } from "@/entities/post";
import type { Post } from "@/entities/post";
import { useUser } from "@/entities/user";
import { useNotifications } from "@/shared/ui/notifications";

/** Лайк публикации; гостю вместо лайка открывает вход. */
export function useLikePost(post: Post, onLogin: () => void) {
  const { user } = useUser();
  const { showError } = useNotifications();
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes_count);
  const [isSending, setIsSending] = useState(false);

  /** Ставит или убирает лайк и показывает счётчик из ответа сервера. */
  async function toggleLike() {
    if (!user) {
      onLogin();
      return;
    }

    setIsSending(true);

    try {
      const result = await togglePostLike(post.id, !liked);

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
