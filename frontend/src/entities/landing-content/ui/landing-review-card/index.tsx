import classNames from "classnames";
import type { LandingReview } from "../../model/types";
import styles from "./style.module.scss";

/** Опубликованный отзыв для главной страницы платформы. */
interface LandingReviewCardProps {
  review: LandingReview;
}

/** Показывает текст отзыва, имя автора и его должность. */
export function LandingReviewCard({ review }: LandingReviewCardProps) {
  return (
    <article className={classNames(styles.card, styles.review)}>
      <p>{review.text}</p>
      <div className={styles.reviewerInfo}>
        <span className={styles.reviewer}>{review.reviewer}</span>
        <span className={styles.position}>{review.position}</span>
      </div>
    </article>
  );
}
