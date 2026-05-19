import Link from "next/link";
import { StarIcon } from "@/source/shared/ui/icons";
import { UserAvatar } from "@/source/shared/ui/UserAvatar";
import s from "./ExpertInfo.module.scss";

function pluralReviews(n: number): string {
  const r = n % 100;
  const d = n % 10;
  if (r >= 11 && r <= 19) return `${n} отзывов`;
  if (d === 1) return `${n} отзыв`;
  if (d >= 2 && d <= 4) return `${n} отзыва`;
  return `${n} отзывов`;
}

interface Props {
  name: string;
  avatarUrl?: string | null;
  rating: number | null;
  reviewCount: number;
  expertPublicId?: string;
}

export function ExpertInfo({ name, avatarUrl, rating, reviewCount, expertPublicId }: Props) {
  const reviewsText = pluralReviews(reviewCount);

  return (
    <div className={s.row}>
      <UserAvatar src={avatarUrl} alt={`Фото ${name || "эксперта"}`} className={s.avatar} />
      <div className={s.details}>
        <span className={s.name}>{name}</span>
        {rating !== null && reviewCount > 0 ? (
          <div className={s.ratingRow}>
            <StarIcon filled width={16} height={16} />
            <span className={s.rating}>
              {rating.toLocaleString("ru-RU", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
            </span>
            <span className={s.dot}>&middot;</span>
            {expertPublicId ? (
              <Link href={`/expert/reviews/${expertPublicId}`} className={s.reviewsLink}>
                {reviewsText}
              </Link>
            ) : (
              <span className={s.reviews}>{reviewsText}</span>
            )}
          </div>
        ) : (
          <span className={s.noReviews}>Отзывов пока нет</span>
        )}
        {expertPublicId && (
          <Link href={`/experts/${expertPublicId}/orders`} className={s.historyLink}>
            История заказов эксперта
          </Link>
        )}
      </div>
    </div>
  );
}
