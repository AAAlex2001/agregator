"use client";

import { createReview } from "@/entities/review";
import { ReviewModal } from "../review-modal";

/** Принятый отклик, участники заказа и действия после публикации или закрытия. */
interface LeaveReviewModalProps {
  responseId: number;
  customerName: string;
  orderTitle: string;
  expertName: string;
  onPublished: () => void;
  onClose: () => void;
}

/** Публикует отзыв заказчика о работе исполнителя по завершённому заказу. */
export function LeaveReviewModal({
  responseId,
  customerName,
  orderTitle,
  expertName,
  onPublished,
  onClose,
}: LeaveReviewModalProps) {
  /** Отправляет оценку и комментарий по принятому отклику. */
  async function publishReview(rating: number, comment: string) {
    await createReview({
      response_id: responseId,
      rating,
      comment,
    });
  }

  return (
    <ReviewModal
      customerName={customerName}
      orderTitle={orderTitle}
      expertName={expertName}
      title="Оставьте отзыв об исполнителе"
      ratingLabel="Оцените работу исполнителя"
      commentPlaceholder="Опишите качество работы, соблюдение сроков и коммуникацию"
      publish={publishReview}
      successMessage="Отзыв успешно опубликован"
      onPublished={onPublished}
      onClose={onClose}
    />
  );
}
