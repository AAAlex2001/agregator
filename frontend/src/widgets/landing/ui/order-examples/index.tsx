"use client";

import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { OrderExampleCard } from "@/entities/landing-content";
import type { LandingOrderExample } from "@/entities/landing-content";
import { Button } from "@/shared/ui/button";
import { Subtitle } from "@/shared/ui/subtitle";
import { SwiperNavigation } from "@/shared/ui/swiper-navigation";
import { Title } from "@/shared/ui/title";
import { DecorativeImage } from "../decorative-image";
import styles from "./style.module.scss";

/** Примеры заказов и тексты заголовка секции из API. */
interface OrderExamplesProps {
  orders: LandingOrderExample[];
  title: string;
  subtitle: string;
}

/** Показывает примеры работ и переход к полному списку заказов. */
export function OrderExamples({ orders, title, subtitle }: OrderExamplesProps) {
  return (
    <section
      className={styles.section}
      id="orders"
    >
      <div className={styles.content}>
        <header className={styles.header}>
          <Title text={title} />
          <Subtitle text={subtitle} />
        </header>
      </div>

      <div className={styles.list}>
        <div className={styles.arrows}>
          <SwiperNavigation
            prevClassName="orders-nav-btn--prev"
            nextClassName="orders-nav-btn--next"
          />
        </div>

        <Swiper
          modules={[Navigation]}
          loop={false}
          slidesPerView="auto"
          spaceBetween={10}
          navigation={{
            prevEl: ".orders-nav-btn--prev",
            nextEl: ".orders-nav-btn--next",
          }}
          className="orders-swiper"
        >
          {orders.map((order) => (
            <SwiperSlide
              key={order.id}
              className={styles.slide}
            >
              <OrderExampleCard order={order} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <Button
        href="/orders"
        variant="secondary"
        className={styles.checkButton}
      >
        Смотреть все заказы
      </Button>

      <DecorativeImage
        src="/orderss.webp"
        sizes="100vw"
        className={styles.backgroundImage}
        fit="cover"
      />
    </section>
  );
}
