"use client";

import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { LandingReviewCard } from "@/entities/landing-content";
import type { LandingReview } from "@/entities/landing-content";
import { Button } from "@/shared/ui/button";
import { Subtitle } from "@/shared/ui/subtitle";
import { SwiperNavigation } from "@/shared/ui/swiper-navigation";
import { Title } from "@/shared/ui/title";
import { DecorativeImage } from "../decorative-image";
import styles from "./style.module.scss";

/** Опубликованные отзывы и тексты заголовка секции из API. */
interface LandingReviewsProps {
  reviews: LandingReview[];
  title: string;
  subtitle: string;
}

/** Показывает отзывы о платформе и переход к их полному списку. */
export function LandingReviews({ reviews, title, subtitle }: LandingReviewsProps) {
  return (
    <section
      className={styles.section}
      id="reviews"
    >
      <div className={styles.content}>
        <div className={styles.headerRow}>
          <header className={styles.header}>
            <Title text={title} />
            <Subtitle text={subtitle} />
          </header>

          <div className={styles.arrows}>
            <DecorativeImage
              src="/belaz_2.webp"
              sizes="672px"
              className={styles.backgroundImageBelAz}
            />
            <DecorativeImage
              src="/coal.webp"
              sizes="246px"
              className={styles.backgroundImageCoal}
            />
            <DecorativeImage
              src="/gold.webp"
              sizes="486px"
              className={styles.backgroundImageCoal}
            />
            <DecorativeImage
              src="/copper.webp"
              sizes="390px"
              className={styles.backgroundImageCoal}
            />
            <SwiperNavigation
              prevClassName="reviews-nav-btn--prev"
              nextClassName="reviews-nav-btn--next"
            />
          </div>
        </div>
      </div>

      <div className={styles.list}>
        <Swiper
          className="reviews-swiper"
          modules={[Navigation]}
          loop={false}
          slidesPerView="auto"
          spaceBetween={10}
          navigation={{
            prevEl: ".reviews-nav-btn--prev",
            nextEl: ".reviews-nav-btn--next",
          }}
        >
          {reviews.map((review) => (
            <SwiperSlide
              key={review.id}
              className={styles.slide}
            >
              <LandingReviewCard review={review} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <Button
        href="/reviews"
        variant="secondary"
        className={styles.checkButton}
      >
        Смотреть все отзывы
      </Button>

      <DecorativeImage
        src="/reviews.webp"
        sizes="100vw"
        className={styles.backgroundImage}
        fit="cover"
      />
    </section>
  );
}
