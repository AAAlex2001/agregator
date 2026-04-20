"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";

import styles from "./reviews.module.scss";
import Card from "@/source/shared/ui/Card";
import SwiperNavigation from "@/source/shared/ui/SwiperNavigation";
import { Title, Subtitle } from "@/source/shared/ui/Typography";

import type { LandingReview } from "../model/landing.data";
type ReviewsProps = {
  reviews: LandingReview[];
};

const Reviews = ({ reviews }: ReviewsProps) => {
  return (
    <section className={styles.section} id="reviews">
      <div className={styles.content}>
        <div className={styles.headerRow}>
          <header className={styles.header}>
            <Title text="О&nbsp;нас говорят профессионалы" />
            <Subtitle text="Мнение тех, кто&nbsp;уже нашёл исполнителя или&nbsp;получил выгодный заказ на&nbsp;нашей платформе" />
          </header>

          <div className={styles.arrows}>
            <div className={styles.backgroundImageBelAz}>
              <Image src="/belaz_2.svg" alt="Belaz" fill style={{ objectFit: "contain" }} />
            </div>
            <div className={styles.backgroundImageCoal}>
              <Image src="/coal.svg" alt="coal" fill style={{ objectFit: "contain" }} />
            </div>
            <div className={styles.backgroundImageCoal}>
              <Image src="/gold.svg" alt="gold" fill style={{ objectFit: "contain" }} />
            </div>
              <div className={styles.backgroundImageCoal}>
              <Image src="/copper.svg" alt="cooper" fill style={{ objectFit: "contain" }} />
            </div>
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
          modules={[Navigation, Pagination]}
          loop={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          spaceBetween={5}
          navigation={{
            prevEl: ".reviews-nav-btn--prev",
            nextEl: ".reviews-nav-btn--next",
          }}
          pagination={{
            clickable: true,
          }}
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id} className={styles.slide}>
              <Card
                variant="review"
                text={review.text}
                reviewer={review.reviewer}
                position={review.position}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className={styles.backgroundImage}>
        <Image
          src="/reviews.png"
          alt="Reviews background"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
    </section>
  );
};

export default Reviews;
