"use client";

import { ReviewCard } from "@/source/entities/review";
import { useExpertReviews } from "@/source/features/reviews";
import { EmptyStateCard } from "@/source/shared/ui";
import Button from "@/source/shared/ui/Button";
import Skeleton from "@/source/shared/ui/Skeleton";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { StarIcon } from "@/source/shared/ui/icons";
import { ExpertReviewsSkeleton } from "./ExpertReviewsSkeleton";
import { ReviewsCarousel } from "./ReviewsCarousel";
import s from "./ExpertReviewsWidget.module.scss";

function formatDateFull(value: string) {
  const date = new Date(value);

  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function ExpertReviewsWidget() {
  const model = useExpertReviews();
  const isEmpty = !model.isLoading && !model.error && model.reviews.length === 0;
  const showRatingInfo = model.isLoading || (!model.error && model.totalReviews > 0);

  return (
    <div className={s.wrapper}>
      <div className={s.pageHead}>
        <Title text="Отзывы наших клиентов" as="h1" className={s.pageTitle} />
        <Subtitle text="Смотрите оценки и комментарии по завершённым заказам" className={s.pageSubtitle} />

        {showRatingInfo && (
          <div className={s.ratingInfo}>
            {model.isLoading ? (
              <>
                <Skeleton className={s.ratingIconSkeleton} rounded="md" />

                <div className={s.ratingDetails}>
                  <Skeleton className={s.ratingValueSkeleton} rounded="pill" />
                  <span className={s.dot}>&middot;</span>
                  <Skeleton className={s.reviewCountSkeleton} rounded="pill" />
                  <Skeleton className={s.reviewLabelSkeleton} rounded="pill" />
                </div>
              </>
            ) : (
              <>
                <StarIcon filled />

                <div className={s.ratingDetails}>
                  <span className={s.ratingValue}>
                    {model.avgRating.toLocaleString("ru-RU", {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })}
                  </span>
                  <span className={s.dot}>&middot;</span>
                  <span className={s.reviewCount}>{model.totalReviews}</span>
                  <span className={s.reviewLabel}>отзывов</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {model.isLoading ? (
        <ExpertReviewsSkeleton />
      ) : model.error ? (
        <div className={s.statusState}>
          <p className={s.statusTitle}>Ошибка загрузки</p>
          <p className={s.statusSubtitle}>{model.error}</p>
          <Button variant="primary" size="sm" onClick={() => void model.reload()}>
            Повторить
          </Button>
        </div>
      ) : isEmpty ? (
        <div className={s.emptyState}>
          <EmptyStateCard
            title="Пока нет отзывов"
            subtitle="После завершения заказов здесь появятся оценки и комментарии заказчиков"
          />
        </div>
      ) : (
        <ReviewsCarousel
          items={model.reviews}
          getKey={(review) => review.id}
          renderItem={(review) => (
            <ReviewCard
              customer={review.company_name}
              order={review.order_title}
              rating={review.rating}
              date={formatDateFull(review.created_at)}
              comment={review.comment}
            />
          )}
        />
      )}
    </div>
  );
}