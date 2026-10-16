"use client";

import { useState } from "react";
import {
  addRtnComment,
  useRtnAttachments,
  useRtnComments,
} from "@/entities/rtn";
import { useNotifications } from "@/shared/ui/notifications";
import type { AddRtnCommentOptions } from "./types";

/** Отправляет комментарий с вложениями и сохраняет заполненную форму при ошибке. */
export function useAddRtnComment({
  parentId,
  onAdded,
}: AddRtnCommentOptions) {
  const { clarificationId, appendComment } = useRtnComments();
  const { showError } = useNotifications();
  const attachments = useRtnAttachments();
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);

  /** Добавляет принятый комментарий и очищает форму после успешной отправки. */
  async function submit() {
    const value = text.trim();

    if (!value || isSending || attachments.isUploading) {
      return;
    }

    setIsSending(true);

    try {
      const comment = await addRtnComment(
        clarificationId,
        value,
        parentId,
        attachments.files,
      );

      appendComment(comment);
      setText("");
      attachments.clear();
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
    setText,
    attachments,
    isSending,
    submit,
  };
}
