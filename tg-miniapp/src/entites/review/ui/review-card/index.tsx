import cn from "classnames";
import { Card } from "@/shared/ui";
import { StarIcon } from "@/shared/ui/icons/expert";
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
            <StarIcon key={n} size={15} className={cn(s.star, { [s.starOff]: n > review.rating })} />
          ))}
        </span>
        <span className={s.date}>{formatDateFull(review.created_at)}</span>
      </div>

      <span className={s.title}>{review.order_title}</span>
      {review.company_name && <span className={s.company}>{review.company_name}</span>}

      {review.comment && <p className={s.comment}>{review.comment}</p>}
    </Card>
  );
}
