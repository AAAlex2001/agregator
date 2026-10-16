import Link from "next/link";
import { StarIcon } from "@/shared/ui/icons";
import { UserAvatar } from "@/shared/ui/user-avatar";
import { formatReviewCount } from "../../model/counts";
import styles from "./style.module.scss";

/** Краткие сведения об исполнителе и ссылки на его отзывы и историю. */
interface ExpertInfoProps {
  name: string;
  avatarUrl?: string | null;
  rating: number | null;
  reviewCount: number;
  expertPublicId?: string;
  hideHistoryLink?: boolean;
  companyName?: string;
  inn?: string | null;
}

/** Показывает исполнителя, его организацию и репутацию на площадке. */
export function ExpertInfo({
  name,
  avatarUrl,
  rating,
  reviewCount,
  expertPublicId,
  hideHistoryLink,
  companyName,
  inn,
}: ExpertInfoProps) {
  const reviewsText = formatReviewCount(reviewCount);
  const hasHistory = reviewCount > 0;

  return (
    <div className={styles.row}>
      <UserAvatar
        src={avatarUrl}
        alt={`Фото ${name || "исполнителя"}`}
        className={styles.avatar}
      />
      <div className={styles.details}>
        <span className={styles.name}>{name}</span>
        {(companyName || inn) && (
          <span className={styles.company}>
            {companyName}
            {companyName && inn ? " · " : ""}
            {inn ? `ИНН ${inn}` : ""}
          </span>
        )}
        {rating !== null && hasHistory ? (
          <div className={styles.ratingRow}>
            <StarIcon
              filled
              width={16}
              height={16}
            />
            <span className={styles.rating}>
              {rating.toLocaleString("ru-RU", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}
            </span>
            <span className={styles.dot}>&middot;</span>
            {expertPublicId ? (
              <Link
                href={`/expert/reviews/${expertPublicId}`}
                className={styles.reviewsLink}
              >
                {reviewsText}
              </Link>
            ) : (
              <span className={styles.reviews}>{reviewsText}</span>
            )}
          </div>
        ) : (
          <span className={styles.noReviews}>Отзывов пока нет</span>
        )}
        {expertPublicId && !hideHistoryLink && hasHistory && (
          <Link
            href={`/experts/${expertPublicId}/orders`}
            className={styles.historyLink}
          >
            История заказов исполнителя
          </Link>
        )}
      </div>
    </div>
  );
}
