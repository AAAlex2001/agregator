"use client";

import { useState, type FormEvent } from "react";
import { createComment, updateComment, type PostComment } from "@/source/entities/posts";
import { useNotifications } from "@/source/shared/ui/Notifications";

interface CommentFormOptions {
  postId: number;
  comment?: PostComment;
  replyTo?: PostComment;
  onSaved: () => void;
}

/** Новый комментарий, ответ или правка своего комментария. */
export function useCommentForm({ postId, comment, replyTo, onSaved }: CommentFormOptions) {
  const { showError } = useNotifications();
  const [text, setText] = useState(comment?.text ?? "");
  const [isSending, setIsSending] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSending(true);
    try {
      if (comment) await updateComment(comment.id, text.trim());
      else await createComment(postId, text.trim(), replyTo?.id ?? null);
      setText("");
      onSaved();
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось сохранить комментарий");
    } finally {
      setIsSending(false);
    }
  };

  return { text, setText, isSending, submit };
}
