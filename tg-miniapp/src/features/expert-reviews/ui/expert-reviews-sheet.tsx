import { useEffect, useState } from "react";
import { FullSheet, SheetHero, Spinner } from "@/shared/ui";
import { pluralRu } from "@/shared/lib/format";
import { fetchExpertReviews, ReviewCard, type ReviewList } from "@/entites/review";
import type { ExpertSummary } from "@/entites/expert";
import s from "./expert-reviews-sheet.module.scss";

interface Props {
  expert: ExpertSummary | null;
  onClose: () => void;
}

export function ExpertReviewsSheet({ expert, onClose }: Props) {
  const [data, setData] = useState<ReviewList | null>(null);

  useEffect(() => {
    if (!expert) return;
    setData(null);
    let active = true;
    fetchExpertReviews(expert.public_id)
      .then((r) => active && setData(r))
      .catch(() => active && setData({ reviews: [], has_more: false, total_reviews: 0, avg_rating: 0 }));
    return () => {
      active = false;
    };
  }, [expert]);

  const desc = expert
    ? expert.rating !== null
      ? `Рейтинг ${expert.rating.toFixed(1)} из 5 · ${expert.review_count} ${pluralRu(expert.review_count, "отзыв", "отзыва", "отзывов")}`
      : "Отзывы заказчиков по завершённым заказам"
    : "";

  return (
    <FullSheet
      open={expert !== null}
      onClose={onClose}
      hero={
        expert && (
          <SheetHero
            light="/profile-hero/expert-light.webp"
            dark="/profile-hero/expert-dark.webp"
            label="Отзывы об эксперте"
            title={expert.full_name}
            desc={desc}
            onClose={onClose}
          />
        )
      }
    >
      {data === null ? (
        <div className={s.loading}>
          <Spinner />
        </div>
      ) : data.reviews.length === 0 ? (
        <p className={s.empty}>Пока нет отзывов</p>
      ) : (
        <div className={s.list}>
          {data.reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </FullSheet>
  );
}
