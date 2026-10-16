"use client";

import cn from "classnames";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Button } from "@/shared/ui/button";
import { Subtitle } from "@/shared/ui/subtitle";
import { SwiperNavigation } from "@/shared/ui/swiper-navigation";
import { Title } from "@/shared/ui/title";
import { LANDING_DIRECTIONS } from "../../config/directions";
import { LandingImageCard } from "../landing-image-card";
import styles from "./style.module.scss";

/** Префикс ссылок для публичных страниц или раздела внутри кабинета. */
interface DirectionsSliderProps {
  basePath?: string;
}

/** Показывает направления работ и переходы к их подробным страницам. */
export function DirectionsSlider({ basePath = "" }: DirectionsSliderProps) {
  return (
    <section className={styles.section}>
      <div className={styles.panel}>
        <header className={styles.header}>
          <div className={styles.headCopy}>
            <Title
              text="Направления работ"
              as="h2"
            />
            <Subtitle
              text="Выберите направление — внутри подробности, исполнители и переход к регистрации."
            />
          </div>
          <div className={styles.arrows}>
            <SwiperNavigation
              prevClassName="directions-nav--prev"
              nextClassName="directions-nav--next"
            />
          </div>
        </header>

        <Swiper
          modules={[Navigation]}
          slidesPerView="auto"
          spaceBetween={16}
          navigation={{
            prevEl: ".directions-nav--prev",
            nextEl: ".directions-nav--next",
          }}
          className={cn(styles.swiper, "directions-swiper")}
        >
          {LANDING_DIRECTIONS.map((direction) => (
            <SwiperSlide key={direction.id}>
              <LandingImageCard
                as="div"
                image={direction.image}
                title={direction.title}
                description={direction.text}
              >
                {direction.href ? (
                  <Button
                    href={`${basePath}${direction.href}`}
                    variant="primary"
                    fullWidth
                    showArrow
                    className={styles.cardButton}
                  >
                    Начать работать
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    fullWidth
                    disabled
                    className={styles.cardButton}
                  >
                    Скоро
                  </Button>
                )}
              </LandingImageCard>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
