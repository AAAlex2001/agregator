import { useState } from "react";
import { Button, Field, InfoRow } from "@/shared/ui";
import { ExpertIcon } from "@/shared/ui/icons/expert";
import { ReviewStarIcon } from "@/shared/ui/icons/interface";
import { pluralRu } from "@/shared/lib/format";
import type { Order } from "@/entites/order";
import { LeaveReviewSheet } from "@/features/leave-review";
import { FileRow } from "../file-row";
import s from "./executor-step.module.scss";

interface Props {
  order: Order;
  onReviewed: () => void;
}

export function ExecutorStep({ order, onReviewed }: Props) {
  const [reviewOpen, setReviewOpen] = useState(false);
  const canReview = order.accepted_response_id !== null && !order.customer_has_review;

  return (
    <div className={s.wrap}>
      <div className={s.head}>
        <span className={s.avatar}>
          <ExpertIcon size={30} />
        </span>
        <div className={s.identity}>
          <span className={s.name}>{order.executor_name}</span>
          {order.executor_rating !== null && (
            <span className={s.rating}>
              <ReviewStarIcon active width={14} height={14} /> {order.executor_rating.toFixed(1)} ·{" "}
              {order.executor_review_count} {pluralRu(order.executor_review_count, "отзыв", "отзыва", "отзывов")}
            </span>
          )}
        </div>
      </div>

      <Field label="Предложение исполнителя">
        <div className={s.block}>
          <InfoRow label="Стоимость" value={order.executor_proposed_sum || "—"} />
          <InfoRow label="Начало работ" value={order.executor_proposed_start_date || "—"} />
          <InfoRow label="Окончание" value={order.executor_proposed_deadline || "—"} />
        </div>
      </Field>

      {order.executor_comment && (
        <Field label="Комментарий исполнителя">
          <div className={s.commentBlock}>
            <p className={s.comment}>{order.executor_comment}</p>
          </div>
        </Field>
      )}

      {order.executor_files.length > 0 && (
        <Field label="Файлы исполнителя">
          <div className={s.files}>
            {order.executor_files.map((url) => (
              <FileRow key={url} url={url} />
            ))}
          </div>
        </Field>
      )}

      {canReview && (
        <Button className={s.reviewBtn} onClick={() => setReviewOpen(true)}>
          Оставить отзыв об исполнителе
        </Button>
      )}

      <LeaveReviewSheet
        open={reviewOpen}
        responseId={order.accepted_response_id}
        expertName={order.executor_name}
        onClose={() => setReviewOpen(false)}
        onSubmitted={onReviewed}
      />
    </div>
  );
}
