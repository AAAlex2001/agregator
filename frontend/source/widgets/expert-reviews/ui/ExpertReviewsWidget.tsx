"use client";

import { ReviewCard } from "@/source/entities/review";
import { useExpertReviews } from "@/source/features/reviews";
import { EmptyStateCard } from "@/source/shared/ui";
import Button from "@/source/shared/ui/Button";
import Skeleton from "@/source/shared/ui/Skeleton";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { StarIcon } from "@/source/shared/ui/icons";
import Loader from "@/source/shared/ui/Loader";
import { useInfiniteScroll } from "@/source/shared/lib/useInfiniteScroll";
import { ExpertReviewsSkeleton } from "./ExpertReviewsSkeleton";
import s from "./ExpertReviewsWidget.module.scss";

function formatDateFull(value: string) {
  const date = new Date(value);

  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function ExpertReviewsWidget({ publicId }: { publicId?: string } = {}) {
  const model = useExpertReviews(publicId);
  const isEmpty = !model.isLoading && !model.error && model.reviews.length === 0;
  const sentinelRef = useInfiniteScroll({
    hasMore: model.hasMore,
    isLoading: model.isLoading || model.isLoadingMore,
    onLoadMore: () => void model.loadMore(),
  });
  const showRatingInfo = model.isLoading || (!model.error && model.totalReviews > 0);
  const showPublicExpertTitle = Boolean(publicId);
  const title = publicId ? "Отзывы об эксперте" : "Отзывы наших клиентов";
  const subtitle = publicId
    ? "Оценки и комментарии заказчиков по завершённым заказам"
    : "Смотрите оценки и комментарии по завершённым заказам";

  return (
    <div className={s.wrapper}>
      <div className={s.pageHead}>
        {showPublicExpertTitle ? (
          <div className={s.pageTitleGroup}>
            <Title text={title} as="h1" className={s.pageTitle} />
            {model.isLoading ? (
              <Skeleton className={s.expertNameSkeleton} rounded="pill" />
            ) : model.expertName ? (
              <span className={s.expertName}>{model.expertName}</span>
            ) : null}
          </div>
        ) : (
          <Title text={title} as="h1" className={s.pageTitle} />
        )}
        <Subtitle text={subtitle} className={s.pageSubtitle} />

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
        <>
          <div className={s.list}>
            {model.reviews.map((review) => (
              <ReviewCard
                key={review.id}
                customer={review.company_name}
                order={review.order_title}
                orderSum={review.order_sum}
                orderStartDate={review.order_start_date}
                orderDeadline={review.order_deadline}
                expertStartDate={review.expert_start_date}
                expertDeadline={review.expert_deadline}
                expertSum={review.expert_sum}
                documents={review.order_documents}
                badges={review.badges}
                rating={review.rating}
                date={formatDateFull(review.created_at)}
                comment={review.comment}
              />
            ))}
            {model.isLoadingMore && (
              <div className={s.loadMore}>
                <Loader label="" size="md" />
              </div>
            )}
          </div>
          <div ref={sentinelRef} aria-hidden="true" />
        </>
      )}
    </div>
  );
}