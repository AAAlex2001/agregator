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
      <div className={s.head}>
        <span className={s.stars}>
          {[1, 2, 3, 4, 5].map((n) => (
            <ReviewStarIcon key={n} active={n <= review.rating} width={20} height={20} />
          ))}
        </span>
        <span className={s.date}>{formatDateFull(review.created_at)}</span>
      </div>

      {review.comment && <p className={s.comment}>{review.comment}</p>}

      <div className={s.order}>
        <span className={s.orderTitle}>{review.order_title}</span>
        {review.company_name && <span className={s.company}>{review.company_name}</span>}
      </div>
    </Card>
  );
}
