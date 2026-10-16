"use client";

import {
  createContactDealReview,
  useExpertContacts,
} from "@/entities/expert-contact";
import type { ContactDeal } from "@/entities/expert-contact";
import { ReviewModal } from "../review-modal";

/** Завершённая сделка по контактам и действия после публикации или закрытия. */
interface LeaveDealReviewModalProps {
  deal: ContactDeal;
  onPublished: () => void;
  onClose: () => void;
}

/** Публикует отзыв покупателя о взаимодействии с исполнителем по сделке. */
export function LeaveDealReviewModal({
  deal,
  onPublished,
  onClose,
}: LeaveDealReviewModalProps) {
  const { refresh } = useExpertContacts();

  /** Отправляет оценку и комментарий по сделке и обновляет рейтинг в каталоге. */
  async function publishReview(rating: number, comment: string) {
    await createContactDealReview(deal.id, {
      rating,
      comment,
    });
    await refresh();
  }

  return (
    <ReviewModal
      customerName={deal.buyer_name}
      orderTitle="Покупка контактов исполнителя"
      expertName={deal.seller_name}
      title="Оставьте отзыв об исполнителе"
      ratingLabel="Оцените взаимодействие с исполнителем"
      commentPlaceholder="Расскажите о взаимодействии и получении контактных данных"
      publish={publishReview}
      successMessage="Отзыв опубликован"
      onPublished={onPublished}
      onClose={onClose}
    />
  );
}
