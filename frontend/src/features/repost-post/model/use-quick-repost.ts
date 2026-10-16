"use client";

import { useState } from "react";
import { repostPost } from "@/entities/post";
import type { Post } from "@/entities/post";
import { useUser } from "@/entities/user";
import { useNotifications } from "@/shared/ui/notifications";

/** Репост без комментария прямо из ленты; гостю открывает вход. */
export function useQuickRepost(post: Post, onLogin: () => void) {
  const { user } = useUser();
  const { showSuccess, showError } = useNotifications();
  const [reposts, setReposts] = useState(post.reposts_count);
  const [isSending, setIsSending] = useState(false);

  /** Публикует репост и увеличивает счётчик под постом. */
  async function repost() {
    if (!user) {
      onLogin();
      return;
    }

    setIsSending(true);

    try {
      await repostPost(post.id, "");
      setReposts(reposts + 1);
      showSuccess("Репост опубликован — он во вкладке «Репосты»");
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Не удалось опубликовать репост",
      );
    } finally {
      setIsSending(false);
    }
  }

  return {
    reposts,
    isSending,
    repost,
  };
}
