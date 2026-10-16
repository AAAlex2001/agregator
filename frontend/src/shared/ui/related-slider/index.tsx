"use client";

import { useId } from "react";
import type { ReactElement } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Button } from "@/shared/ui/button";
import { SwiperNavigation } from "@/shared/ui/swiper-navigation";
import "swiper/css";
import "swiper/css/navigation";
import styles from "./style.module.scss";

/** Заголовок, карточки и необязательная ссылка под слайдером. */
interface RelatedSliderProps {
  title: string;
  children: ReactElement[];
  cta?: {
    href: string;
    label: string;
  };
}

/** Показывает горизонтальную подборку карточек с отдельной навигацией. */
export function RelatedSlider({
  title,
  children,
  cta,
}: RelatedSliderProps) {
  const instanceId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const prevClassName = `related-prev-${instanceId}`;
  const nextClassName = `related-next-${instanceId}`;

  if (children.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <SwiperNavigation
          prevClassName={prevClassName}
          nextClassName={nextClassName}
          className={styles.navigation}
        />
      </div>

      <Swiper
        modules={[Navigation]}
        slidesPerView="auto"
        spaceBetween={20}
        navigation={{
          prevEl: `.${prevClassName}`,
          nextEl: `.${nextClassName}`,
        }}
        className={styles.swiper}
      >
        {children.map((child) => (
          <SwiperSlide
            key={child.key}
            className={styles.slide}
          >
            {child}
          </SwiperSlide>
        ))}
      </Swiper>

      {cta && (
        <div className={styles.ctaRow}>
          <Button
            href={cta.href}
            variant="outline"
            className={styles.ctaButton}
          >
            {cta.label}
          </Button>
        </div>
      )}
    </section>
  );
}
