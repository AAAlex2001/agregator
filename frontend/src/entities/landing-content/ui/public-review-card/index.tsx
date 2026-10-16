import { ListCard } from "@/shared/ui/list-card";
import { StarIcon } from "@/shared/ui/icons";
import type { LandingReview } from "../../model/types";
import styles from "./style.module.scss";

/** Опубликованный отзыв с автором, должностью и датой. */
interface PublicReviewCardProps {
  review: LandingReview;
}

/** Показывает полную дату публикации; некорректную дату скрывает. */
function formatReviewDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

/** Показывает опубликованный отзыв с прежней пятизвёздочной оценкой. */
export function PublicReviewCard({ review }: PublicReviewCardProps) {
  return (
    <ListCard
      meta={`Отзыв от ${formatReviewDate(review.created_at)}`}
      titleLabel="Кто оставил:"
      title={review.reviewer || "—"}
      bottomLeftLabel="Должность:"
      bottomLeftValue={review.position || "—"}
      leftExtra={
        <>
          <div className={styles.ratingBlock}>
            <span className={styles.label}>Оценка:</span>
            <div
              className={styles.ratingRow}
              role="img"
              aria-label="Оценка 5 из 5"
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  filled
                  width={20}
                  height={20}
                />
              ))}
            </div>
          </div>
          {review.text && (
            <div className={styles.commentBlock}>
              <span className={styles.label}>Отзыв:</span>
              <p className={styles.quote}>
                <span className={styles.quoteMark}>&ldquo;</span>
                {review.text}
                <span className={styles.quoteMark}>&rdquo;</span>
              </p>
            </div>
          )}
        </>
      }
    />
  );
}
