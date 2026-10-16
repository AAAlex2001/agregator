"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { createPostComment, updatePostComment } from "@/entities/post";
import { useNotifications } from "@/shared/ui/notifications";
import type { CommentFormOptions } from "./types";

/** Новый комментарий, ответ или правка своего; при ошибке текст остаётся в форме. */
export function useCommentForm({
  postId,
  comment,
  replyTo,
  onSaved,
}: CommentFormOptions) {
  const { showError } = useNotifications();
  const [text, setText] = useState(comment?.text ?? "");
  const [isSending, setIsSending] = useState(false);

  /** Сохраняет правку или отправляет новый комментарий и очищает форму. */
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSending(true);

    try {
      if (comment) {
        await updatePostComment(comment.id, text.trim());
      } else {
        await createPostComment(postId, text.trim(), replyTo?.id ?? null);
      }

      setText("");
      onSaved();
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Не удалось отправить комментарий",
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
