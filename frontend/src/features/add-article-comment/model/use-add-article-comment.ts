"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { addArticleComment, useArticleComments } from "@/entities/article";
import { useNotifications } from "@/shared/ui/notifications";
import type { AddArticleCommentOptions } from "./types";

/** Отправляет комментарий или ответ и оставляет текст в форме при ошибке. */
export function useAddArticleComment({
  parentId,
  onAdded,
}: AddArticleCommentOptions) {
  const { articleId, appendComment } = useArticleComments();
  const { showError } = useNotifications();
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);

  /** Отправляет непустой текст и добавляет принятый комментарий в обсуждение. */
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = text.trim();

    if (!value || isSending) {
      return;
    }

    setIsSending(true);

    try {
      const comment = await addArticleComment(articleId, value, parentId);

      appendComment(comment);
      setText("");
      onAdded?.();
    } catch (error) {
      showError(
        error instanceof Error
          ? error.message
          : "Не удалось отправить комментарий",
      );
    } finally {
      setIsSending(false);
    }
  }

  return {
    text,
    isSending,
    setText,
    submit,
  };
}
