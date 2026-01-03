"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "./industry-directions.module.scss";
import Image from "next/image";
import { useState } from "react";
import { SwiperNavigation, Card } from "@/app/components";

const industries = [
  {
    id: 1,
    title: "ДОБЫВАЮЩАЯ ПРОМЫШЛЕННОСТЬ",
    description: [
      "Угольная, сланцевая, торфяная (Э1)",
      "Горнорудная и нерудная (Э2)",
      "Нефтегазодобыча (Э4)",
      "Геологоразведка (Э6)"
    ],
      photo: "/industry_1.jpg",
  },
  {
    id: 2,
    title: "ОБРАБАТЫВАЮЩАЯ ПРОМЫШЛЕННОСТЬ",
    description: [
      "Химическая, нефтехимическая (Э7)",
      "Металлургия (Э13)",
      "Пищевая промышленность (Э10)",
      "Переработка сырья (Э15)"
    ],
      photo: "/industry_2.jpg",
  },
  {
    id: 3,
    title: "ТРАНСПОРТ И ИНФРАСТРУКТУРА",
    description: [
      "Трубопроводный транспорт (Э5)",
      "Нефтепродуктообеспечение (Э8)",
      "Газоснабжение (Э11)",
      "Канатные дороги (Э14.1, Э14.2)"
    ],
      photo: "/industry_3.jpg",
  },
  {
    id: 4,
    title: "ЭНЕРГЕТИКА И ОПАСНЫЕ ПРОИЗВОДСТВА",
    description: [
      "Тепло- и электроэнергетика (Э12)",
      "Взрывчатые материалы (Э3.1, Э3.2)",
      "Водоподготовка (Э9)"
    ],
      photo: "/industry_4.jpg",
  },
  {
    id: 5,
    title: "СПЕЦИАЛЬНЫЕ ОБЪЕКТЫ",
    description: [
      "Грузоподъемные механизмы (Э14.4)"
    ],
      photo: "/industry_5.jpg",
  },
];


const IndustryDirections = () => {
  const [isHovered, setIsHovered] = useState<number | null>(null);

  return (
    <section className={styles.section} id="advantages">
      <div className={styles.content}>
        <h1 className={styles.title}>Эксперты по промышленной безопасности для всех отраслей промышленности</h1>
        <h2 className={styles.subtitle}>От шахт до объектов переработки сырья. Найдите специалиста или проект в вашей аккредитации</h2>
      </div>
      <div className={styles.card}>
        <div className={styles.arrows}>
          <SwiperNavigation
            prevClassName="industry-nav-btn--prev"
            nextClassName="industry-nav-btn--next"
          />
        </div>
        <Swiper
          modules={[Navigation, Pagination]}
          loop={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          spaceBetween={20}
          navigation={{
            prevEl: ".industry-nav-btn--prev",
            nextEl: ".industry-nav-btn--next",
          }}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            1440: {
              enabled: false,
              allowTouchMove: false,
            },
          }}
          className={`${styles.swiper} industry-swiper`}
        >
          {industries.map((industry) => (
            <SwiperSlide key={industry.id} className={styles.slide}>
              <Card
                variant="industry"
                title={industry.title}
                description={industry.description}
                photo={industry.photo}
                isHovered={isHovered === industry.id}
                onMouseEnter={() => setIsHovered(industry.id)}
                onMouseLeave={() => setIsHovered(null)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className={styles.backgroundImage}>
        <Image src="/industry.png" alt="Industry background" fill style={{ objectFit: "cover" }} />
      </div>
    </section>
  );
};

export default IndustryDirections;