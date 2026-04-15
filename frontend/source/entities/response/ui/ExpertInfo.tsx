import { ProfileIcon, StarIcon } from "@/shared/ui/icons";
import s from "./ExpertInfo.module.scss";

function pluralReviews(n: number) {
  const r = n % 100;
  const d = n % 10;
  if (r >= 11 && r <= 19) return `${n} отзывов`;
  if (d === 1) return `${n} отзыв`;
  if (d >= 2 && d <= 4) return `${n} отзыва`;
  return `${n} отзывов`;
}

interface Props {
  name: string;
  rating: number | null;
  reviewCount: number;
}

export function ExpertInfo({ name, rating, reviewCount }: Props) {
  return (
    <div className={s.row}>
      <div className={s.avatar}><ProfileIcon width={24} height={24} /></div>
      <div className={s.details}>
        <span className={s.name}>{name}</span>
        {rating !== null && reviewCount > 0 ? (
          <div className={s.ratingRow}>
            <StarIcon filled width={16} height={16} />
            <span className={s.rating}>
              {rating.toLocaleString("ru-RU", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
            </span>
            <span className={s.dot}>&middot;</span>
            <span className={s.reviews}>{pluralReviews(reviewCount)}</span>
          </div>
        ) : (
          <span className={s.noReviews}>Отзывов пока нет</span>
        )}
      </div>
    </div>
  );
}
