import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Screen } from "@/widgets/app-shell";
import { Spinner } from "@/shared/ui";
import { StarIcon } from "@/shared/ui/icons/expert";
import { pluralRu } from "@/shared/lib/format";
import { fetchExpertReviews, ReviewCard, type ReviewList } from "@/entites/review";
import s from "./style.module.scss";

export function ExpertReviewsPage() {
  const { publicId } = useParams<{ publicId: string }>();
  const [data, setData] = useState<ReviewList | null>(null);

  useEffect(() => {
    if (!publicId) return;
    let active = true;
    fetchExpertReviews(publicId)
      .then((r) => active && setData(r))
      .catch(() => active && setData({ reviews: [], has_more: false, total_reviews: 0, avg_rating: 0 }));
    return () => {
      active = false;
    };
  }, [publicId]);

  return (
    <Screen title="Отзывы об эксперте" panel>
      <div className={s.wrap}>
        {data === null ? (
          <div className={s.loading}>
            <Spinner />
          </div>
        ) : (
          <>
            {data.expert_name && <p className={s.expert}>{data.expert_name}</p>}
            {data.total_reviews > 0 && (
              <p className={s.summary}>
                <StarIcon className={s.star} /> {data.avg_rating.toFixed(1)} · {data.total_reviews}{" "}
                {pluralRu(data.total_reviews, "отзыв", "отзыва", "отзывов")}
              </p>
            )}

            {data.reviews.length === 0 ? (
              <p className={s.empty}>Пока нет отзывов</p>
            ) : (
              <div className={s.list}>
                {data.reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Screen>
  );
}
