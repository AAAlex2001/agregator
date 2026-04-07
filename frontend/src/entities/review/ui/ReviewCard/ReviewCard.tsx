"use client";

import { StarIcon } from "@/shared/ui/icons";
import styles from "./reviewCard.module.scss";

export interface ReviewCardProps {
  customer: string;
  order: string;
  rating: number;
  date: string;
  comment: string;
}

const ReviewCard = ({ customer, order, rating, date, comment }: ReviewCardProps) => {
  return (
    <article className={styles.card}>
      <p className={styles.customer}>{customer}</p>
      <p className={styles.order}>{order}</p>
      <div className={styles.ratingDate}>
        <div className={styles.stars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon key={star} filled={star <= rating} />
          ))}
        </div>
        <span className={styles.date}>{date}</span>
      </div>
      <div className={styles.commentBlock}>
        <p className={styles.commentText}>{comment}</p>
      </div>
    </article>
  );
};

export default ReviewCard;
