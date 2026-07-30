"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { ChevronIcon } from "@/source/shared/ui/icons";
import { KADASTR_SERVICES } from "../model/content";
import s from "./services.module.scss";

export function KadastrServices() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = KADASTR_SERVICES[activeIndex];

  return (
    <section className={s.section} id="vidy-rabot">
      <div className={s.content}>
        <header className={s.header}>
          <Title text="Виды кадастровых работ" as="h2" />
          <Subtitle text="Разместите заявку на любую из работ — кадастровые инженеры из СРО откликнутся с ценой и сроками." />
        </header>

        <div className={s.panel}>
          <div className={s.grid}>
            <ul className={s.list}>
              {KADASTR_SERVICES.map((service, index) => {
                const isActive = index === activeIndex;
                return (
                  <li
                    key={service.title}
                    className={isActive ? `${s.item} ${s.itemActive}` : s.item}
                  >
                    <button
                      type="button"
                      className={s.head}
                      onClick={() => setActiveIndex(index)}
                      aria-expanded={isActive}
                    >
                      <span className={s.num}>{String(index + 1).padStart(2, "0")}</span>
                      <span className={s.itemTitle}>{service.title}</span>
                      <ChevronIcon className={s.chevron} color="currentColor" />
                    </button>
                    {isActive && (
                      <div className={s.body}>
                        <p className={s.desc}>{service.text}</p>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className={s.visual}>
              <Image
                key={active.image}
                src={active.image}
                alt={active.title}
                fill
                sizes="(max-width: 1024px) 100vw, 720px"
                className={s.visualImg}
              />
            </div>
          </div>

          <Swiper className={s.slider} slidesPerView={1.1} spaceBetween={12}>
            {KADASTR_SERVICES.map((service) => (
              <SwiperSlide key={service.title} className={s.slide}>
                <div className={s.slideImage}>
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="90vw"
                    className={s.slideImg}
                  />
                </div>
                <div className={s.slideBody}>
                  <h3 className={s.slideTitle}>{service.title}</h3>
                  <p className={s.slideDesc}>{service.text}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
