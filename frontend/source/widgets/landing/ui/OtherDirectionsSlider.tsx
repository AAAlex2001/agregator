"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import Button from "@/source/shared/ui/Button";
import SwiperNavigation from "@/source/shared/ui/SwiperNavigation";
import { Title } from "@/source/shared/ui/Typography";
import { SERVICES_SHOWCASE } from "../model/servicesShowcase";
import s from "./other-directions-slider.module.scss";

interface OtherDirectionsSliderProps {
  currentSlug?: string;
  title?: string;
}

export function OtherDirectionsSlider({
  currentSlug,
  title = "Смотрите также другие направления",
}: OtherDirectionsSliderProps) {
  const items = SERVICES_SHOWCASE.filter((item) => item.slug !== currentSlug);

  return (
    <section className={s.section}>
      <div className={s.content}>
        <div className={s.panel}>
          <header className={s.header}>
            <Title text={title} className={s.title} />
            <div className={s.arrows}>
              <SwiperNavigation prevClassName="dir-nav--prev" nextClassName="dir-nav--next" />
            </div>
          </header>

          <Swiper
            modules={[Navigation]}
            slidesPerView="auto"
            spaceBetween={16}
            navigation={{ prevEl: ".dir-nav--prev", nextEl: ".dir-nav--next" }}
            className={`${s.swiper} dir-swiper`}
          >
            {items.map((item) => (
              <SwiperSlide key={item.id} className={s.slide}>
                <div className={s.cardItem}>
                  <div className={s.image}>
                    <Image src={item.image} alt={item.title} fill sizes="340px" className={s.img} />
                  </div>
                  <div className={s.body}>
                    <h3 className={s.cardTitle}>{item.title}</h3>
                    <p className={s.cardDesc}>{item.description}</p>
                    <Button
                      href={`/${item.slug}`}
                      variant="primary"
                      fullWidth
                      showArrow
                      className={s.cardBtn}
                    >
                      Начать работать
                    </Button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
