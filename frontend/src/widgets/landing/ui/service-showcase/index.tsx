"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import type { ServiceShowcaseItem } from "../../model/types";
import { ServiceShowcaseOption } from "../service-showcase-option";
import { ServiceShowcaseSlide } from "../service-showcase-slide";
import styles from "./style.module.scss";

/** Иллюстрированные пункты каталога работ или аудиторий направления. */
interface ServiceShowcaseProps {
  items: ServiceShowcaseItem[];
}

/** Переключает описание на широком экране и показывает слайдер на мобильном. */
export function ServiceShowcase({ items }: ServiceShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(true);
  const activeItem = items[activeIndex];

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1440px)");

    /** Подключает мобильный слайдер только при подходящей ширине окна. */
    function updateLayout() {
      setIsDesktop(mediaQuery.matches);
    }

    updateLayout();
    mediaQuery.addEventListener("change", updateLayout);

    return () => {
      mediaQuery.removeEventListener("change", updateLayout);
    };
  }, []);

  return (
    <div className={styles.panel}>
      <div className={styles.grid}>
        <ul className={styles.list}>
          {items.map((item, index) => (
            <ServiceShowcaseOption
              key={item.title}
              item={item}
              index={index}
              isActive={index === activeIndex}
              onSelect={setActiveIndex}
            />
          ))}
        </ul>

        <div className={styles.right}>
          <div className={styles.visual}>
            <Image
              key={activeItem.image}
              src={activeItem.image}
              alt={activeItem.title}
              fill
              sizes="(max-width: 1439px) 100vw, 720px"
              className={styles.visualImg}
            />
          </div>
          <p className={styles.visualDesc}>{activeItem.text}</p>
        </div>
      </div>

      {!isDesktop && (
        <Swiper
          className={styles.slider}
          slidesPerView={1.1}
          spaceBetween={12}
        >
          {items.map((item) => (
            <SwiperSlide
              key={item.title}
              className={styles.slide}
            >
              <ServiceShowcaseSlide item={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
