"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";

import AuthHeader from "@/app/landing/header/AuthHeader";
import ReviewCard from "@/app/components/ReviewCard";
import { Loader } from "@/app/components";
import { ArrowIcon, StarIcon } from "@/app/icons";
import { fetchMyReviews } from "./api";
import type { ReviewItem } from "./api";
import styles from "./reviews.module.scss";

export default function ExpertReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [swiperRef, setSwiperRef] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    void (async () => {
      try {
        const data = await fetchMyReviews();
        setReviews(data.reviews);
        setTotalReviews(data.total);
        setAvgRating(data.avg_rating);
      } catch {
        // пустой список
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const totalPages = reviews.length;

  const formatDate = (iso: string): string => {
    const d = new Date(iso);
    return d.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const paginationItems: (number | "ellipsis")[] = (() => {
    if (totalPages <= 4) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, "ellipsis", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, "ellipsis", totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages];
  })();

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex);
    setCurrentPage(swiper.activeIndex + 1);
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
    swiperRef?.slideTo(page - 1);
  };

  const handlePrev = () => {
    swiperRef?.slidePrev();
  };

  const handleNext = () => {
    swiperRef?.slideNext();
  };

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
          <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
            <Loader label="" size="lg" />
          </div>
        ) : reviews.length === 0 ? (
          <p style={{ textAlign: "center", color: "#999", padding: "60px 0", fontSize: "16px" }}>
            Отзывов пока нет
          </p>
        ) : (
          <div className={styles.reviewsSection}>
            <div className={styles.shadeLeft} />
            <div className={styles.shadeRight} />
            <Swiper
              className={styles.swiper}
              modules={[Navigation]}
              slidesPerView="auto"
              spaceBetween={24}
              centeredSlides
              loop={false}
              onSwiper={setSwiperRef}
              onSlideChange={handleSlideChange}
            >
              {reviews.map((review, index) => (
                <SwiperSlide key={review.id} className={styles.slide}>
                  <div
                    className={`${styles.slideInner} ${
                      index === activeIndex ? styles.slideActive : ""
                    }`}
                  >
                    <ReviewCard
                      customer={review.company_name}
                      order={review.order_title}
                      rating={review.rating}
                      date={formatDate(review.created_at)}
                      comment={review.comment}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {reviews.length > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles.slideBtn}
                  onClick={handlePrev}
                  aria-label="Назад"
                >
                  <ArrowIcon className={styles.arrowLeft} color="#FFDDA9" />
                </button>

                <div className={styles.pages}>
                  {paginationItems.map((item, index) => {
                    if (item === "ellipsis") {
                      return (
                        <span key={`ellipsis-${index}`} className={styles.pageBtn} aria-hidden="true">
                          ...
                        </span>
                      );
                    }

                    return (
                      <button
                        key={item}
                        className={`${styles.pageBtn} ${item === currentPage ? styles.pageBtnActive : ""}`}
                        onClick={() => handlePageClick(item)}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>

                <button
                  className={styles.slideBtn}
                  onClick={handleNext}
                  aria-label="Вперед"
                >
                  <ArrowIcon color="#FFDDA9" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
