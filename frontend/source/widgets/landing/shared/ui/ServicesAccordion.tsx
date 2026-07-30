"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { ChevronIcon } from "@/source/shared/ui/icons";
import s from "./services-accordion.module.scss";

export interface ServicesAccordionItem {
  title: string;
  text: string;
  image: string;
}

type ServicesAccordionProps = {
  items: ServicesAccordionItem[];
  actions?: ReactNode;
};

export function ServicesAccordion({ items, actions }: ServicesAccordionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = items[activeIndex];

  return (
    <div className={s.panel}>
      <div className={s.grid}>
        <ul className={s.list}>
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <li key={item.title} className={isActive ? `${s.item} ${s.itemActive}` : s.item}>
                <button
                  type="button"
                  className={s.head}
                  onClick={() => setActiveIndex(index)}
                  aria-expanded={isActive}
                >
                  <span className={s.num}>{String(index + 1).padStart(2, "0")}</span>
                  <span className={s.itemTitle}>{item.title}</span>
                  <ChevronIcon className={s.chevron} color="currentColor" />
                </button>
                {isActive && (
                  <div className={s.body}>
                    <p className={s.desc}>{item.text}</p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <div className={s.right}>
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
          {actions}
        </div>
      </div>

      <Swiper className={s.slider} slidesPerView={1.1} spaceBetween={12}>
        {items.map((item) => (
          <SwiperSlide key={item.title} className={s.slide}>
            <div className={s.slideImage}>
              <Image src={item.image} alt={item.title} fill sizes="90vw" className={s.slideImg} />
            </div>
            <div className={s.slideBody}>
              <h3 className={s.slideTitle}>{item.title}</h3>
              <p className={s.slideDesc}>{item.text}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {actions && <div className={s.mobileActions}>{actions}</div>}
    </div>
  );
}
