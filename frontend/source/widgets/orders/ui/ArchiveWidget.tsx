"use client";

import { useState } from "react";
import type { OrderCardData } from "@/source/entities/order";
import { createReview } from "@/source/entities/response";
import { ArchiveList } from "@/source/features/orders/archive";
import { AddReviewModalContainer } from "@/source/features/reviews";
import { useNotifications } from "@/source/shared/ui/Notifications";
import s from "./ArchiveWidget.module.scss";

/** Архив заказов. После отзыва список перечитывается, чтобы убрать кнопку у заказа. */
export function ArchiveWidget() {
  const { showSuccess, showError } = useNotifications();
  const [reviewTarget, setReviewTarget] = useState<OrderCardData | null>(null);
  const [version, setVersion] = useState(0);

  const submitReview = async (payload: { rating: number; comment: string }) => {
    if (!reviewTarget?.acceptedResponseId) return;
    try {
      await createReview({ response_id: reviewTarget.acceptedResponseId, ...payload });
      showSuccess("Отзыв успешно опубликован");
      setReviewTarget(null);
      setVersion(version + 1);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось оставить отзыв");
    }
  };

  return (
    <div className={s.wrapper}>
      <ArchiveList key={version} onLeaveReview={setReviewTarget} />
      <AddReviewModalContainer
        isOpen={reviewTarget !== null}
        customerName={reviewTarget?.customer ?? ""}
        orderTitle={reviewTarget?.title ?? ""}
        expertName={reviewTarget?.executorName ?? ""}
        onClose={() => setReviewTarget(null)}
        onSubmit={submitReview}
      />
    </div>
  );
}
