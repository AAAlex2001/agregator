"use client";

import cn from "classnames";
import { useState } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { LandingIndustryCard } from "@/entities/landing-content";
import type { LandingIndustry } from "@/entities/landing-content";
import { Subtitle } from "@/shared/ui/subtitle";
import { SwiperNavigation } from "@/shared/ui/swiper-navigation";
import { Title } from "@/shared/ui/title";
import styles from "./style.module.scss";

/** Отрасли применения платформы и заголовок секции из API. */
interface ServiceIndustriesProps {
  industries: LandingIndustry[];
  title: string;
  subtitle: string;
}

/** Собирает карточки отраслей в слайдер с сеткой на широком экране. */
export function ServiceIndustries({
  industries,
  title,
  subtitle,
}: ServiceIndustriesProps) {
  const [hoveredIndustryId, setHoveredIndustryId] = useState<number | null>(null);

  return (
    <section
      className={styles.section}
      id="industries"
    >
      <div className={styles.content}>
        <header className={styles.header}>
          <Title text={title} />
          <Subtitle text={subtitle} />
        </header>
      </div>

      <div className={styles.card}>
        <div className={styles.arrows}>
          <SwiperNavigation
            prevClassName="industry-nav-btn--prev"
            nextClassName="industry-nav-btn--next"
          />
        </div>

        <Swiper
          modules={[Navigation]}
          loop={false}
          slidesPerView="auto"
          spaceBetween={10}
          navigation={{
            prevEl: ".industry-nav-btn--prev",
            nextEl: ".industry-nav-btn--next",
          }}
          breakpoints={{
            1440: {
              enabled: false,
              allowTouchMove: false,
            },
          }}
          className={cn(styles.swiper, "industry-swiper")}
        >
          {industries.map((industry) => (
            <SwiperSlide
              key={industry.id}
              className={styles.slide}
            >
              <LandingIndustryCard
                industry={industry}
                isHovered={hoveredIndustryId === industry.id}
                onHover={setHoveredIndustryId}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
