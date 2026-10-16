"use client";

import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import type { LandingAdvantage } from "@/entities/landing-content";
import { Subtitle } from "@/shared/ui/subtitle";
import { SwiperNavigation } from "@/shared/ui/swiper-navigation";
import { Title } from "@/shared/ui/title";
import { LandingImageCard } from "../landing-image-card";
import styles from "./style.module.scss";

/** Загруженные преимущества платформы и тексты заголовка секции. */
interface PlatformAdvantagesProps {
  features: LandingAdvantage[];
  title: string;
  subtitle: string;
}

/** Показывает преимущества платформы в горизонтальной ленте карточек. */
export function PlatformAdvantages({
  features,
  title,
  subtitle,
}: PlatformAdvantagesProps) {
  return (
    <section
      className={styles.section}
      id="advantages"
    >
      <div className={styles.panel}>
        <header className={styles.header}>
          <div className={styles.headCopy}>
            <Title
              text={title}
              as="h2"
            />
            <Subtitle text={subtitle} />
          </div>
          <div className={styles.arrows}>
            <SwiperNavigation
              prevClassName="advantages-nav--prev"
              nextClassName="advantages-nav--next"
            />
          </div>
        </header>

        <Swiper
          modules={[Navigation]}
          slidesPerView="auto"
          spaceBetween={16}
          navigation={{
            prevEl: ".advantages-nav--prev",
            nextEl: ".advantages-nav--next",
          }}
          className={styles.swiper}
        >
          {features.map((feature) => (
            <SwiperSlide
              key={feature.id}
              className={styles.slide}
            >
              <LandingImageCard
                image={feature.photo}
                title={feature.title}
                description={feature.description}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
