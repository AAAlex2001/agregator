"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import SwiperNavigation from "@/source/shared/ui/SwiperNavigation";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import type { LandingAdvantage } from "../model/landing.data";
import s from "./advantages.module.scss";

type AdvantagesProps = {
  features: LandingAdvantage[];
  title: string;
  subtitle: string;
};

const Advantages = ({ features, title, subtitle }: AdvantagesProps) => {
  return (
    <section className={s.section} id="advantages">
      <div className={s.panel}>
        <header className={s.header}>
          <div className={s.headCopy}>
            <Title text={title} as="h2" />
            <Subtitle text={subtitle} />
          </div>
          <div className={s.arrows}>
            <SwiperNavigation prevClassName="advantages-nav--prev" nextClassName="advantages-nav--next" />
          </div>
        </header>

        <Swiper
          modules={[Navigation]}
          slidesPerView="auto"
          spaceBetween={16}
          navigation={{ prevEl: ".advantages-nav--prev", nextEl: ".advantages-nav--next" }}
          className={s.swiper}
        >
          {features.map((feature) => (
            <SwiperSlide key={feature.id} className={s.slide}>
              <article className={s.card}>
                <div className={s.image}>
                  <Image src={feature.photo} alt={feature.title} fill sizes="380px" className={s.img} />
                </div>
                <div className={s.body}>
                  <h3 className={s.cardTitle}>{feature.title}</h3>
                  <p className={s.cardText}>{feature.description}</p>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Advantages;
