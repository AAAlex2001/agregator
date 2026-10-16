"use client";

import { useState } from "react";
import { useNotifications } from "@/shared/ui/notifications";
import type { LeaveReviewOptions } from "./types";

/** Хранит черновик отзыва; при ошибке публикации оставляет оценку и комментарий. */
export function useLeaveReview({
  publish,
  successMessage,
  onPublished,
  onClose,
}: LeaveReviewOptions) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const { showError, showSuccess } = useNotifications();

  /** Меняет выбранную оценку работы исполнителя. */
  function changeRating(value: number) {
    setRating(value);
  }

  /** Меняет текст ещё не опубликованного отзыва. */
  function changeComment(value: string) {
    setComment(value);
  }

  /** Закрывает форму после завершения текущей отправки. */
  function close() {
    if (!isSubmitting) {
      onClose();
    }
  }

  /** Публикует отзыв и сообщает об успехе для закрытия формы и обновления списка. */
  async function submit() {
    if (isSubmitting || rating < 1) {
      return;
    }

    setSubmitting(true);

    try {
      await publish(rating, comment.trim());
      showSuccess(successMessage);
      onPublished();
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Не удалось оставить отзыв",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return {
    rating,
    comment,
    isSubmitting,
    changeRating,
    changeComment,
    close,
    submit,
  };
}
