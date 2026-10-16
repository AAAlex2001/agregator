"use client";

import { useState } from "react";
import { followPostAuthor } from "@/entities/post";
import { useUser } from "@/entities/user";
import { useNotifications } from "@/shared/ui/notifications";

/** Подписка на автора публикаций и отписка; гостю открывает вход. */
export function useFollowAuthor(
  authorId: number,
  initialFollowing: boolean,
  onLogin: () => void,
) {
  const { user } = useUser();
  const { showSuccess, showError } = useNotifications();
  const [following, setFollowing] = useState(initialFollowing);
  const [isSending, setIsSending] = useState(false);

  /** Меняет подписку и сообщает о результате. */
  async function toggleFollow() {
    if (!user) {
      onLogin();
      return;
    }

    setIsSending(true);

    try {
      await followPostAuthor(authorId, !following);
      setFollowing(!following);
      showSuccess(following ? "Вы отписались от автора" : "Вы подписались на автора");
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Не удалось изменить подписку",
      );
    } finally {
      setIsSending(false);
    }
  }

  return {
    following,
    isSending,
    toggleFollow,
  };
}
