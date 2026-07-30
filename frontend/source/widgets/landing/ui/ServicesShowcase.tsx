"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Button from "@/source/shared/ui/Button";
import { ChevronIcon, TelegramIcon } from "@/source/shared/ui/icons";
import { SERVICES_SHOWCASE } from "../model/servicesShowcase";
import s from "./services-showcase.module.scss";

const BOT_URL = "https://t.me/resursplus_robot";

function ShowcaseActions({ buttonText, className }: { buttonText: string; className?: string }) {
  return (
    <div className={className ? `${s.actions} ${className}` : s.actions}>
      <Button href="/register" variant="primary" fullWidth showArrow className={s.button}>
        {buttonText}
      </Button>
      <Button
        href={BOT_URL}
        target="_blank"
        rel="noopener noreferrer"
        variant="telegram"
        fullWidth
        className={s.button}
      >
        <span>Начать работать в Telegram</span>
        <TelegramIcon />
      </Button>
    </div>
  );
}

type ServicesShowcaseProps = {
  buttonText: string;
};

const ServicesShowcase = ({ buttonText }: ServicesShowcaseProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = SERVICES_SHOWCASE[activeIndex];

  return (
    <div className={s.panel}>
      <div className={s.grid}>
        <ul className={s.list}>
          {SERVICES_SHOWCASE.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <li key={item.id} className={isActive ? `${s.item} ${s.itemActive}` : s.item}>
                <button
                  type="button"
                  className={s.head}
                  onClick={() => setActiveIndex(index)}
                  aria-expanded={isActive}
                >
                  <span className={s.num}>{String(item.id).padStart(2, "0")}</span>
                  <span className={s.itemTitle}>{item.title}</span>
                  <ChevronIcon className={s.chevron} color="currentColor" />
                </button>
                {isActive && (
                  <div className={s.body}>
                    <p className={s.desc}>{item.description}</p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <div className={s.right}>
          <div className={s.visual}>
            <Image
              key={active.id}
              src={active.image}
              alt={active.title}
              fill
              sizes="(max-width: 1024px) 100vw, 720px"
              className={s.visualImg}
            />
            <span className={s.visualTitle}>{active.title}</span>
          </div>
          <ShowcaseActions buttonText={buttonText} />
        </div>
      </div>

      <Swiper className={s.slider} slidesPerView={1.1} spaceBetween={12}>
        {SERVICES_SHOWCASE.map((item) => (
          <SwiperSlide key={item.id} className={s.slide}>
            <div className={s.slideImage}>
              <Image src={item.image} alt={item.title} fill sizes="90vw" className={s.slideImg} />
            </div>
            <div className={s.slideBody}>
              <h3 className={s.slideTitle}>{item.title}</h3>
              <p className={s.slideDesc}>{item.description}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <ShowcaseActions buttonText={buttonText} className={s.mobileActions} />
    </div>
  );
};

export default ServicesShowcase;
