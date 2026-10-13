"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { repostPost } from "@/source/entities/posts";
import { useNotifications } from "@/source/shared/ui/Notifications";

/** Репост с комментарием. После публикации — к своим репостам. */
export function useRepostForm(postId: number) {
  const router = useRouter();
  const { showSuccess, showError } = useNotifications();
  const [html, setHtml] = useState("");
  const [isSending, setIsSending] = useState(false);

  const publish = async () => {
    setIsSending(true);
    try {
      await repostPost(postId, html);
      showSuccess("Репост опубликован");
      router.push("/posts/reposts");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось опубликовать репост");
      setIsSending(false);
    }
  };

  return { html, setHtml, isSending, publish };
}
