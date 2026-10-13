"use client";

import { useState } from "react";
import { createComment, updateComment, type PostComment } from "@/source/entities/posts";

interface Props {
  postId: number;
  comment?: PostComment;
  replyTo?: PostComment;
  onSaved: () => void;
}

/** Отправляет новый комментарий, ответ или исправление текста. */
export function useCommentForm({ postId, comment, replyTo, onSaved }: Props) {
  const [text, setText] = useState(comment?.text ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy || !text.trim()) return;
    setBusy(true);
    setError("");
    try {
      if (comment) await updateComment(comment.id, text.trim());
      else await createComment(postId, text.trim(), replyTo?.id ?? null);
      setText("");
      onSaved();
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Не удалось сохранить комментарий");
    } finally {
      setBusy(false);
    }
  };
  return { text, setText, busy, error, submit };
}
