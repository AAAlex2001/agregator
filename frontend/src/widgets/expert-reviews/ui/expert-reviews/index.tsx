"use client";

import { useExpertReviews } from "@/entities/review";
import { useInfiniteScroll } from "@/shared/lib/use-infinite-scroll";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/empty-state";
import { Loader } from "@/shared/ui/loader";
import { ExpertReviewsHead } from "../expert-reviews-head";
import { ReviewCard } from "../review-card";
import { ReviewCardSkeleton } from "../review-card-skeleton";
import styles from "./style.module.scss";

/** Публичный идентификатор исполнителя; без него показываются свои отзывы. */
interface ExpertReviewsProps {
  publicId?: string;
}

/** Показывает отзывы исполнителя и догружает следующие страницы при прокрутке. */
export function ExpertReviews({ publicId }: ExpertReviewsProps) {
  const reviews = useExpertReviews(publicId);
  const sentinelRef = useInfiniteScroll({
    hasMore: reviews.page?.has_more ?? false,
    isLoading: reviews.isLoading || reviews.isLoadingMore,
    onLoadMore: reviews.loadMore,
  });

  return (
    <section className={styles.wrapper}>
      <ExpertReviewsHead
        isExpertPage={Boolean(publicId)}
        page={reviews.page}
        hasError={Boolean(reviews.error)}
      />

      {reviews.error ? (
        <div
          className={styles.statusState}
          role="alert"
        >
          <p className={styles.statusTitle}>Ошибка загрузки</p>
          <p className={styles.statusSubtitle}>{reviews.error}</p>
          <Button
            variant="primary"
            size="sm"
            onClick={reviews.reload}
          >
            Повторить
          </Button>
        </div>
      ) : !reviews.page ? (
        <div
          className={styles.list}
          aria-hidden="true"
        >
          <ReviewCardSkeleton />
          <ReviewCardSkeleton />
          <ReviewCardSkeleton />
        </div>
      ) : reviews.page.reviews.length === 0 ? (
        <div className={styles.emptyState}>
          <EmptyState
            title="Пока нет отзывов"
            subtitle="После завершения заказов здесь появятся оценки и комментарии заказчиков"
          />
        </div>
      ) : (
        <>
          <ul className={styles.list}>
            {reviews.page.reviews.map((review) => (
              <li key={review.id}>
                <ReviewCard review={review} />
              </li>
            ))}
          </ul>
          {reviews.isLoadingMore && (
            <div className={styles.loadMore}>
              <Loader
                label=""
                size="md"
              />
            </div>
          )}
          <div
            ref={sentinelRef}
            aria-hidden="true"
          />
        </>
      )}
    </section>
  );
}
