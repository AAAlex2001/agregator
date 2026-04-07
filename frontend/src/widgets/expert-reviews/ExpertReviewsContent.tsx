"use client";

import { useEffect } from "react";
import AuthHeader from "@/widgets/header/AuthHeader";
import ReviewCard from "@/entities/review/ui/ReviewCard";
import { Loader } from "@/shared/ui";
import { StarIcon } from "@/shared/ui/icons";
import { ResponsesSwiper } from "@/widgets/responses-swiper";
import { formatDateFull } from "@/shared/lib/formatDate";
import { useExpertReviewsState } from "@/features/response/review/model/state";
import { loadReviews } from "@/features/response/review/model/actions";
import styles from "./expert-reviews.module.scss";

export function ExpertReviewsContent() {
  const {
    reviews, setReviews,
    totalReviews, setTotalReviews,
    avgRating, setAvgRating,
    isLoading, setIsLoading,
  } = useExpertReviewsState();

  useEffect(() => {
    void loadReviews(
      (data) => {
        setReviews(data.reviews);
        setTotalReviews(data.total);
        setAvgRating(data.avg_rating);
        setIsLoading(false);
      },
      () => setIsLoading(false),
    );
  }, []);

  return (
    <>
      <AuthHeader />
      <div className={styles.wrapper}>
        <div className={styles.titleBlock}>
          <h1 className={styles.heading}>Отзывы наших клиентов</h1>
          <div className={styles.ratingInfo}>
            <StarIcon filled />
            <div className={styles.ratingDetails}>
              <span className={styles.ratingValue}>{avgRating.toFixed(1).replace(".", ",")}</span>
              <span className={styles.dot}>&middot;</span>
              <span className={styles.reviewCount}>{totalReviews}</span>
              <span className={styles.reviewLabel}>отзывов</span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className={styles.loaderWrap}>
            <Loader label="" size="lg" />
          </div>
        ) : reviews.length === 0 ? (
          <p className={styles.emptyText}>Отзывов пока нет</p>
        ) : (
          <ResponsesSwiper
            items={reviews}
            getKey={(r) => r.id}
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
    </>
  );
}
