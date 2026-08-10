"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import Button from "@/source/shared/ui/Button";
import SwiperNavigation from "@/source/shared/ui/SwiperNavigation";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { SERVICES_SHOWCASE } from "../../shared/model/servicesShowcase";
import { buildLandingHref } from "../../shared/model/buildHref";
import s from "./directions-slider.module.scss";

interface Props {
  basePath?: string;
}

export function DirectionsSlider({ basePath = "" }: Props) {
  return (
    <section className={s.section}>
      <div className={s.panel}>
        <header className={s.header}>
          <div className={s.headCopy}>
            <Title text="Направления работ" as="h2" />
            <Subtitle text="Выберите направление — внутри подробности, исполнители и переход к регистрации." />
          </div>
          <div className={s.arrows}>
            <SwiperNavigation prevClassName="directions-nav--prev" nextClassName="directions-nav--next" />
          </div>
        </header>

        <Swiper
          modules={[Navigation]}
          slidesPerView="auto"
          spaceBetween={16}
          navigation={{ prevEl: ".directions-nav--prev", nextEl: ".directions-nav--next" }}
          className={`${s.swiper} directions-swiper`}
        >
          {SERVICES_SHOWCASE.map((item) => (
            <SwiperSlide key={item.id}>
              <div className={s.card}>
                <div className={s.image}>
                  <Image src={item.image} alt={item.title} fill sizes="380px" className={s.img} />
                </div>
                <div className={s.body}>
                  <h3 className={s.cardTitle}>{item.title}</h3>
                  <p className={s.cardText}>{item.text}</p>
                  {item.href ? (
                    <Button
                      href={buildLandingHref(basePath, item.href)}
                      variant="primary"
                      fullWidth
                      showArrow
                      className={s.cardButton}
                    >
                      Начать работать
                    </Button>
                  ) : (
                    <Button variant="primary" fullWidth disabled className={s.cardButton}>
                      Скоро
                    </Button>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
