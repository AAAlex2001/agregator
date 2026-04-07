"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";

import styles from "./orders.module.scss";
import { SwiperNavigation, Card, Button, Title, Subtitle } from "@/shared/ui";

import type { LandingOrder } from "@/shared/config/landing.data";
type OrdersProps = {
  orders: LandingOrder[];
};

const Orders = ({ orders }: OrdersProps) => {
  return (
    <section className={styles.section} id="orders">
      <div className={styles.content}>
        <header className={styles.header}>
          <Title text="Примеры работ на платформе" />
          <Subtitle text="Актуальные проекты от предприятий горнодобывающей отрасли. Находите подходящие и откликайтесь напрямую" />
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
    modules={[Navigation, Pagination]}
    loop={true}
    centeredSlides={true}
    slidesPerView={"auto"}
    spaceBetween={5}
    navigation={{
      prevEl: ".orders-nav-btn--prev",
      nextEl: ".orders-nav-btn--next",
    }}
    pagination={{
      clickable: true,
    }}
    className="orders-swiper"
  >
    {orders.map((order) => (
      <SwiperSlide key={order.title} className={styles.slide}>
        <Card
          variant="order"
          title={order.title}
          price={order.price}
          description={order.description}
        />
      </SwiperSlide>
    ))}
  </Swiper>
      </div>

      <Button variant="secondary" className={styles.checkButton}>
        Смотреть все заказы
      </Button>

      <div className={styles.backgroundImage}>
        <Image src="/orderss.png" alt="Orders background" fill style={{ objectFit: "cover" }} />
      </div>
    </section>
  );
};

export default Orders;
