import { StarIcon } from "@/source/shared/ui/icons";
import s from "./ReviewCard.module.scss";

export interface ReviewCardProps {
  customer: string;
  order: string;
  rating: number;
  date: string;
  comment: string;
}

export function ReviewCard({ customer, order, rating, date, comment }: ReviewCardProps) {
  return (
    <article className={s.card}>
      <p className={s.customer}>{customer}</p>
      <p className={s.order}>{order}</p>

      <div className={s.ratingDate}>
        <div className={s.stars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon key={star} filled={star <= rating} />
          ))}
        </div>

        <span className={s.date}>{date}</span>
      </div>

      <div className={s.commentBlock}>
        <p className={s.commentText}>{comment}</p>
      </div>
    </article>
  );
}