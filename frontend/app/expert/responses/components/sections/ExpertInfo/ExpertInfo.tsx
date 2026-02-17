"use client";

import { ProfileIcon, StarIcon } from "@/app/icons";
import { Button } from "@/app/components";
import styles from "./expertInfo.module.scss";

interface ExpertInfoProps {
  expertName: string;
  expertRating: number | null;
  expertReviewCount: number;
  onHistory?: () => void;
}

function formatReviewCount(count: number): string {
  const lastTwo = count % 100;
  const lastOne = count % 10;

  if (lastTwo >= 11 && lastTwo <= 19) return `${count} отзывов`;
  if (lastOne === 1) return `${count} отзыв`;
  if (lastOne >= 2 && lastOne <= 4) return `${count} отзыва`;
  return `${count} отзывов`;
}

const ExpertInfo = ({
  expertName,
  expertRating,
  expertReviewCount,
  onHistory,
}: ExpertInfoProps) => {
  return (
    <div className={styles.expertInfo}>
      <div className={styles.avatar}>
        <ProfileIcon width={24} height={24} />
      </div>

      <div className={styles.details}>
        <span className={styles.name}>{expertName}</span>
        {expertRating !== null && expertReviewCount > 0 ? (
          <div className={styles.ratingRow}>
            <StarIcon filled />
            <div className={styles.ratingValues}>
              <span className={styles.ratingNumber}>
                {expertRating.toLocaleString("ru-RU", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
              </span>
              <span className={styles.dot}>·</span>
              <span className={styles.reviewCount}>
                {formatReviewCount(expertReviewCount)}
              </span>
            </div>
          </div>
        ) : (
          <span className={styles.noReviews}>Отзывов пока нет</span>
        )}
      </div>

      {onHistory && (
        <Button variant="outline" size="sm" onClick={onHistory} className={styles.historyBtn}>
          История заказов
        </Button>
      )}
    </div>
  );
};

export default ExpertInfo;
