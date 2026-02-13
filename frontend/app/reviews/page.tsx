"use client";

import { useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";

import Header from "@/app/landing/header/Header";
import ReviewCard from "@/app/components/ReviewCard";
import { ArrowIcon, StarIcon } from "@/app/icons";
import styles from "./reviews.module.scss";

interface Review {
  id: number;
  customer: string;
  order: string;
  rating: number;
  date: string;
  comment: string;
}

const mockReviews: Review[] = [
  {
    id: 1,
    customer: "ООО «Ресурс Плюс»",
    order: "Экспертиза промышленной безопасности технических устройств",
    rating: 5,
    date: "12.01.2026",
    comment:
      "Отличная работа! Экспертиза была проведена в кратчайшие сроки. Все документы оформлены грамотно и в полном соответствии с требованиями.",
  },
  {
    id: 2,
    customer: "ПАО «Газпром»",
    order: "Экспертиза промышленной безопасности зданий и сооружений",
    rating: 4,
    date: "15.01.2026",
    comment:
      "Качественно выполненная экспертиза. Специалисты подошли к работе ответственно, выявили все критические моменты.",
  },
  {
    id: 3,
    customer: "АО «Транснефть»",
    order: "Экспертиза промышленной безопасности технических устройств",
    rating: 5,
    date: "20.01.2026",
    comment:
      "Профессиональный подход к работе. Результаты экспертизы предоставлены в срок, все замечания учтены и исправлены.",
  },
  {
    id: 4,
    customer: "ООО «НефтеГазСервис»",
    order: "Экспертиза промышленной безопасности технических устройств",
    rating: 5,
    date: "22.01.2026",
    comment:
      "Рекомендуем данную компанию. Быстро, качественно и по разумной цене. Обязательно обратимся снова.",
  },
  {
    id: 5,
    customer: "ПАО «Лукойл»",
    order: "Экспертиза промышленной безопасности зданий и сооружений",
    rating: 5,
    date: "25.01.2026",
    comment:
      "Великолепный сервис! Команда экспертов справилась с задачей на высшем уровне. Документация безупречна.",
  },
  {
    id: 6,
    customer: "ООО «ПромЭкспертиза»",
    order: "Экспертиза промышленной безопасности технических устройств",
    rating: 4,
    date: "28.01.2026",
    comment:
      "Хорошая экспертиза. Единственный минус — немного затянули со сроками, но качество на высоте.",
  },
  {
    id: 7,
    customer: "АО «Сибур»",
    order: "Экспертиза промышленной безопасности технических устройств",
    rating: 5,
    date: "01.02.2026",
    comment:
      "Отличный результат! Все было сделано оперативно и профессионально. Сотрудничеством довольны.",
  },
  {
    id: 8,
    customer: "ООО «ТехноСервис»",
    order: "Экспертиза промышленной безопасности зданий и сооружений",
    rating: 5,
    date: "05.02.2026",
    comment:
      "Превосходная работа. Эксперты детально изучили все аспекты безопасности и предоставили полный отчёт.",
  },
];

const TOTAL_REVIEWS = 8;
const AVG_RATING = 4.8;
const TOTAL_PAGES = 5;

export default function ReviewsPage() {
  const [swiperRef, setSwiperRef] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
    const page = Math.floor(swiper.realIndex / Math.ceil(mockReviews.length / TOTAL_PAGES)) + 1;
    setCurrentPage(Math.min(page, TOTAL_PAGES));
  }, []);

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
    const slideIndex = Math.floor((page - 1) * (mockReviews.length / TOTAL_PAGES));
    swiperRef?.slideTo(slideIndex);
  };

  const handlePrev = () => {
    swiperRef?.slidePrev();
  };

  const handleNext = () => {
    swiperRef?.slideNext();
  };

  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <div className={styles.shadeLeft} />
        <div className={styles.shadeRight} />

        <div className={styles.titleBlock}>
          <h1 className={styles.heading}>Отзывы наших клиентов</h1>
          <div className={styles.ratingInfo}>
            <StarIcon filled />
            <div className={styles.ratingDetails}>
              <span className={styles.ratingValue}>{AVG_RATING}</span>
              <span className={styles.dot}>&middot;</span>
              <span className={styles.reviewCount}>{TOTAL_REVIEWS}</span>
              <span className={styles.reviewLabel}>отзывов</span>
            </div>
          </div>
        </div>

        <div className={styles.reviewsSection}>
          <Swiper
            className={styles.swiper}
            modules={[Navigation]}
            slidesPerView="auto"
            spaceBetween={24}
            centeredSlides
            loop
            onSwiper={setSwiperRef}
            onSlideChange={handleSlideChange}
          >
            {mockReviews.map((review, index) => (
              <SwiperSlide key={review.id} className={styles.slide}>
                <div
                  className={`${styles.slideInner} ${
                    index === activeIndex ? styles.slideActive : ""
                  }`}
                >
                  <ReviewCard
                    customer={review.customer}
                    order={review.order}
                    rating={review.rating}
                    date={review.date}
                    comment={review.comment}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className={styles.pagination}>
            <button
              className={styles.slideBtn}
              onClick={handlePrev}
              aria-label="Назад"
            >
              <ArrowIcon className={styles.arrowLeft} color="#FFDDA9" />
            </button>

            <div className={styles.pages}>
              {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`${styles.pageBtn} ${
                      page === currentPage ? styles.pageBtnActive : ""
                    }`}
                    onClick={() => handlePageClick(page)}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            <button
              className={styles.slideBtn}
              onClick={handleNext}
              aria-label="Вперед"
            >
              <ArrowIcon color="#FFDDA9" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
