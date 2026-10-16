"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { repostPost } from "@/entities/post";
import { useNotifications } from "@/shared/ui/notifications";

/** Репост с комментарием; после публикации открывает свои репосты. */
export function useRepostForm(postId: number) {
  const router = useRouter();
  const { showSuccess, showError } = useNotifications();
  const [html, setHtml] = useState("");
  const [isSending, setIsSending] = useState(false);

  /** Публикует репост; при ошибке оставляет комментарий в форме. */
  async function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSending(true);

    try {
      await repostPost(postId, html);
      showSuccess("Репост опубликован");
      router.push("/posts/reposts");
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Не удалось опубликовать репост",
      );
      setIsSending(false);
    }
  }

  return {
    isSending,
    setHtml,
    publish,
  };
}
