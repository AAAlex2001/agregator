import { Card, Field } from "@/shared/ui";
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

      <Field label="Оценка:">
        <div className={s.stars} role="img" aria-label={`Оценка ${review.rating} из 5`}>
          {[1, 2, 3, 4, 5].map((n) => (
            <ReviewStarIcon key={n} active={n <= review.rating} />
          ))}
        </div>
      </Field>

      {review.comment && (
        <Field label="Отзыв:">
          <p className={s.quote}>
            <span className={s.quoteMark}>&ldquo;</span>
            {review.comment}
            <span className={s.quoteMark}>&rdquo;</span>
          </p>
        </Field>
      )}

      <Field label="Название заказа:">
        <span className={s.value}>{review.order_title || "—"}</span>
      </Field>

      {review.company_name && (
        <Field label="Организатор:">
          <span className={s.value}>{review.company_name}</span>
        </Field>
      )}
    </Card>
  );
}
