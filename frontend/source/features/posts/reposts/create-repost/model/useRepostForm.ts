"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { repostPost } from "@/source/entities/posts";

/** Публикует репост с комментарием и открывает свои репосты. */
export function useRepostForm(postId: number) {
  const router = useRouter();
  const [html, setHtml] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submitting = useRef(false);

  /** Отправляет репост с комментарием. */
  async function publish() {
    if (submitting.current) return;
    submitting.current = true;
    setPending(true);
    setError(null);
    try {
      await repostPost(postId, html);
      router.push("/posts/reposts");
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Не удалось опубликовать репост",
      );
      submitting.current = false;
      setPending(false);
    }
  }

  return { html, setHtml, pending, error, publish };
}
