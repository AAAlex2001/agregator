"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "./industry-directions.module.scss";
import Image from "next/image";
import { useState } from "react";
import Card from "@/source/shared/ui/Card";
import SwiperNavigation from "@/source/shared/ui/SwiperNavigation";
import { Title, Subtitle } from "@/source/shared/ui/Typography";

import type { LandingIndustry } from "../model/landing.data";
type IndustryDirectionsProps = {
  industries: LandingIndustry[];
};

const IndustryDirections = ({ industries }: IndustryDirectionsProps) => {
  const [isHovered, setIsHovered] = useState<number | null>(null);

  return (
    <section className={styles.section} id="advantages">
      <div className={styles.content}>
        <Title text="Эксперты по промышленной безопасности для всех отраслей промышленности" className={styles.title} />
        <Subtitle text="От шахт до объектов переработки сырья. Найдите специалиста или проект в вашей аккредитации" className={styles.subtitle} />
      </div>
      <div className={styles.card}>
        <div className={styles.arrows}>
          <SwiperNavigation
            prevClassName="industry-nav-btn--prev"
            nextClassName="industry-nav-btn--next"
          />
        </div>
        <Swiper
          modules={[Navigation, Pagination]}
          loop={false}
          centeredSlides={true}
          slidesPerView={"auto"}
          spaceBetween={20}
          navigation={{
            prevEl: ".industry-nav-btn--prev",
            nextEl: ".industry-nav-btn--next",
          }}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            1440: {
              enabled: false,
              allowTouchMove: false,
            },
          }}
          className={`${styles.swiper} industry-swiper`}
        >
          {industries.map((industry) => (
            <SwiperSlide key={industry.id} className={styles.slide}>
              <Card
                variant="industry"
                title={industry.title}
                description={industry.description}
                photo={industry.photo}
                isHovered={isHovered === industry.id}
                onMouseEnter={() => setIsHovered(industry.id)}
                onMouseLeave={() => setIsHovered(null)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className={styles.backgroundImage}>
        <Image src="/industry.png" alt="Industry background" fill style={{ objectFit: "cover" }} />
      </div>
    </section>
  );
};

export default IndustryDirections;