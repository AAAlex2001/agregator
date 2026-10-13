"use client";

import { useState } from "react";
import { followPostAuthor } from "@/source/entities/posts";
import { useSession } from "@/source/entities/session";
import { useAuthModal } from "@/source/shared/lib/auth-modal";
import { useNotifications } from "@/source/shared/ui/Notifications";

/** Подписка на автора и отписка; гостю предлагает войти. */
export function useFollowAuthor(authorId: number, initial: boolean) {
  const { user } = useSession();
  const { openAuth } = useAuthModal();
  const { showSuccess, showError } = useNotifications();
  const [following, setFollowing] = useState(initial);
  const [isBusy, setIsBusy] = useState(false);

  const toggle = async () => {
    if (!user) {
      return openAuth("login");
    }

    setIsBusy(true);
    try {
      await followPostAuthor(authorId, !following);
      setFollowing(!following);
      const notice = following ? "Вы отписались от автора" : "Вы подписались на автора";
      showSuccess(notice);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Не удалось изменить подписку";
      showError(message);
    } finally {
      setIsBusy(false);
    }
  };

  return { following, isBusy, toggle };
}
