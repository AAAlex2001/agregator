"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";

import s from "./orders.module.scss";
import Button from "@/source/shared/ui/Button";
import Card from "@/source/shared/ui/Card";
import SwiperNavigation from "@/source/shared/ui/SwiperNavigation";
import { Title, Subtitle } from "@/source/shared/ui/Typography";

import type { LandingOrder } from "../model/landing.data";
type OrdersProps = {
  orders: LandingOrder[];
};

const Orders = ({ orders }: OrdersProps) => {
  return (
    <section className={s.section} id="orders">
      <div className={s.content}>
        <header className={s.header}>
          <Title text="Примеры работ на платформе" />
          <Subtitle text="Актуальные проекты от предприятий горнодобывающей отрасли. Находите подходящие и откликайтесь напрямую" />
        </header>
      </div>

      <div className={s.list}>
  <div className={s.arrows}>
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
      <SwiperSlide key={order.title} className={s.slide}>
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

      <Button variant="secondary" className={s.checkButton}>
        Смотреть все заказы
      </Button>

      <div className={s.backgroundImage}>
        <Image src="/orderss.png" alt="Orders background" fill sizes="100vw" quality={70} style={{ objectFit: "cover" }} />
      </div>
    </section>
  );
};

export default Orders;
