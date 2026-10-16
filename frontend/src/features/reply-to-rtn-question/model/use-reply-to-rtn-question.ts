"use client";

import { useState } from "react";
import { addRtnQuestionReply, useRtnAttachments } from "@/entities/rtn";
import { useNotifications } from "@/shared/ui/notifications";
import type { ReplyToRtnQuestionOptions } from "./types";

/** Публикует ответ ведомства с обязательным документом и поясняющим текстом. */
export function useReplyToRtnQuestion({
  questionId,
  onAdded,
}: ReplyToRtnQuestionOptions) {
  const { showError, showSuccess } = useNotifications();
  const attachments = useRtnAttachments();
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);

  /** Добавляет принятый ответ в список и очищает форму после публикации. */
  async function submit() {
    if (isSending || attachments.isUploading || attachments.files.length === 0) {
      return;
    }

    setIsSending(true);

    try {
      const reply = await addRtnQuestionReply(
        questionId,
        text,
        attachments.files,
      );

      onAdded(reply);
      setText("");
      attachments.clear();
      showSuccess("Ответ опубликован");
    } catch (error) {
      showError(
        error instanceof Error
          ? error.message
          : "Не удалось опубликовать ответ",
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
