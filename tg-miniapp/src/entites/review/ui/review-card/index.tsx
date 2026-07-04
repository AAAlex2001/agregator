import { Card } from "@/shared/ui";
import { ReviewStarIcon } from "@/shared/ui/icons/interface";
import type { ReviewItem } from "../../model/api";
import s from "./style.module.scss";

function formatDateFull(value: string): string {
  return new Date(value).toLocaleDateString("ru-RU", { day: "2-digit", month: "long", year: "numeric" });
}

export function ReviewCard({ review }: { review: ReviewItem }) {
  return (
    <Card className={s.card}>
      <span className={s.meta}>Отзыв от {formatDateFull(review.created_at)}</span>

      <div className={s.block}>
        <span className={s.label}>Оценка:</span>
        <div className={s.stars} role="img" aria-label={`Оценка ${review.rating} из 5`}>
          {[1, 2, 3, 4, 5].map((n) => (
            <ReviewStarIcon key={n} active={n <= review.rating} />
          ))}
        </div>
      </div>

      {review.comment && (
        <div className={s.block}>
          <span className={s.label}>Отзыв:</span>
          <p className={s.quote}>
            <span className={s.quoteMark}>&ldquo;</span>
            {review.comment}
            <span className={s.quoteMark}>&rdquo;</span>
          </p>
        </div>
      )}

      <div className={s.block}>
        <span className={s.label}>Название заказа:</span>
        <span className={s.value}>{review.order_title || "—"}</span>
      </div>

      {review.company_name && (
        <div className={s.block}>
          <span className={s.label}>Организатор:</span>
          <span className={s.value}>{review.company_name}</span>
        </div>
      )}
    </Card>
  );
}
