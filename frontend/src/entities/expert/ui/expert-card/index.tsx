import Link from "next/link";
import type { ReactNode } from "react";
import { formatDateRu } from "@/shared/lib/format-date";
import { Button } from "@/shared/ui/button";
import { StarIcon } from "@/shared/ui/icons";
import { UserAvatar } from "@/shared/ui/user-avatar";
import { formatOrderCount, formatReviewCount } from "../../model/counts";
import styles from "./style.module.scss";

/** Репутация исполнителя и содержимое средней и правой колонок карточки. */
interface ExpertCardProps {
  publicId: string;
  fullName: string;
  avatarUrl: string | null;
  rating: number | null;
  reviewCount: number;
  completedOrdersCount?: number;
  joinedAt?: string;
  details: ReactNode;
  aside?: ReactNode;
}

/** Показывает исполнителя, его рейтинг, ссылки на отзывы и историю заказов. */
export function ExpertCard({
  publicId,
  fullName,
  avatarUrl,
  rating,
  reviewCount,
  completedOrdersCount,
  joinedAt,
  details,
  aside,
}: ExpertCardProps) {
  const filledStars = rating === null ? 0 : Math.round(rating);
  const ratingText = rating === null
    ? "—"
    : rating.toLocaleString("ru-RU", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });

  return (
    <article className={styles.card}>
      <div className={styles.body}>
        <div className={styles.left}>
          <div className={styles.header}>
            <UserAvatar
              src={avatarUrl}
              alt={`Фото ${fullName}`}
              className={styles.avatar}
            />
            <div className={styles.headerText}>
              <h3 className={styles.name}>{fullName}</h3>
              {joinedAt && (
                <span className={styles.joined}>
                  На платформе с {formatDateRu(joinedAt)}
                </span>
              )}
            </div>
          </div>

          <dl className={styles.stats}>
            <div className={styles.statRow}>
              <dt className={styles.statLabel}>Рейтинг:</dt>
              <dd className={styles.statValue}>
                <span
                  className={styles.stars}
                  aria-hidden="true"
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      filled={star <= filledStars}
                      width={18}
                      height={18}
                    />
                  ))}
                </span>
                <span className={styles.statNumber}>{ratingText}</span>
              </dd>
            </div>
            {completedOrdersCount !== undefined && (
              <div className={styles.statRow}>
                <dt className={styles.statLabel}>Количество заказов:</dt>
                <dd className={styles.statValue}>
                  <span className={styles.statNumber}>
                    {formatOrderCount(completedOrdersCount)}
                  </span>
                </dd>
              </div>
            )}
            <div className={styles.statRow}>
              <dt className={styles.statLabel}>Количество отзывов:</dt>
              <dd className={styles.statValue}>
                {reviewCount > 0 ? (
                  <Link
                    href={`/expert/reviews/${publicId}`}
                    className={styles.statLink}
                  >
                    {formatReviewCount(reviewCount)}
                  </Link>
                ) : (
                  <span className={styles.statNumber}>0 отзывов</span>
                )}
              </dd>
            </div>
          </dl>

          <div className={styles.actions}>
            <Button
              variant="secondary"
              size="sm"
              href={`/experts/${publicId}/orders`}
            >
              История заказов
            </Button>
          </div>
        </div>

        <div className={styles.center}>{details}</div>
        {aside && <div className={styles.side}>{aside}</div>}
      </div>
    </article>
  );
}
