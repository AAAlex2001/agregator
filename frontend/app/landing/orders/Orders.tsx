"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import styles from "./orders.module.scss";

const orders = [
  {
    title: "Экспертиза проекта модернизации ",
    price: "1 200 000 ₽",
    description: "установки ЭЛОУ-АВТ. Требуется: Эксперт Э7 ОБ",
  },
  {
    title: "Проект вскрыши карьера для золоторудного месторождения",
    price: "850 000 ₽",
    description: "Объём вскрыши: 1.8 млн куб. м.",
  },
  {
    title: "Расчёт устойчивости борта карьера глубиной 150 м",
    price: "2 200 000 ₽",
    description: "Требуется: Эксперт Э2 ЗС",
  },
  {
    title: "Аудит системы вентиляции угольной шахты",
    price: "1 350 000 ₽",
    description: "Глубина: 750 м, Требуется: Эксперт Э3 Г",
  },
  {
    title: "Проект реконструкции нефтебазы",
    price: "2 800 000 ₽",
    description: "Емкость хранения: 100 000 м³",
  },
  {
    title: "Расчет прочности конструкций буровой вышки",
    price: "1 900 000 ₽",
    description: "Для морского бурения, Требуется: Эксперт Э1 С",
  },
  {
    title: "Экспертиза системы противопожарной защиты НПЗ",
    price: "1 650 000 ₽",
    description: "Требуется: Эксперт Э7 ОБ",
  },
  {
    title: "Проект отвала горной массы",
    price: "920 000 ₽",
    description: "Объем: 5 млн м³, Высота: 65 м",
  },
  {
    title: "Анализ рисков при строительстве метрополитена",
    price: "3 200 000 ₽",
    description: "Протяженность: 8 км, Требуется: Эксперт Э2 ЗС",
  },
  {
    title: "Расчет системы водопонижения карьера",
    price: "1 100 000 ₽",
    description: "Дебит воды: 500 м³/час",
  },
  {
    title: "Экспертиза проекта коксовой батареи",
    price: "2 100 000 ₽",
    description: "Производительность: 1 млн т/год",
  },
  {
    title: "Проект усиления фундаментов под оборудование",
    price: "780 000 ₽",
    description: "Динамические нагрузки, Требуется: Эксперт Э1 С",
  },
  {
    title: "Аудит системы управления промышленной безопасностью",
    price: "1 450 000 ₽",
    description: "Для горнодобывающего предприятия",
  },
  {
    title: "Расчет системы молниезащиты химического завода",
    price: "550 000 ₽",
    description: "Площадь: 25 га, Требуется: Эксперт Э4 Э",
  },
  {
    title: "Экспертиза проекта золотоизвлекательной фабрики",
    price: "2 900 000 ₽",
    description: "Производительность: 3 млн т/год руды",
  },
  {
    title: "Проект системы пылеподавления на карьере",
    price: "670 000 ₽",
    description: "Площадь обработки: 50 га",
  },
  {
    title: "Анализ устойчивости бортов разреза",
    price: "1 250 000 ₽",
    description: "Глубина: 180 м, Угол откоса: 38°",
  },
  {
    title: "Расчет системы аварийного охлаждения реактора",
    price: "1 850 000 ₽",
    description: "Температура: 450°C, Давление: 15 МПа",
  },
];

const Orders = () => {
  return (
    <section className={styles.section} id="orders">
      <div className={styles.content}>
        <header className={styles.header}>
          <h1>Реальные заказы с платформы</h1>
          <p>
            Актуальные проекты от предприятий горнодобывающей отрасли. Находите
            подходящие и откликайтесь напрямую
          </p>
        </header>
      </div>

      <div className={styles.list}>
  <div className={styles.arrows}>
    <button
      className="orders-nav-btn orders-nav-btn--prev"
      type="button"
      aria-label="Предыдущий"
    >
      <span>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 12L13 18M19 12L13 6M19 12H5"
            stroke="#FFDDA9"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>

    <button
      className="orders-nav-btn orders-nav-btn--next"
      type="button"
      aria-label="Следующий"
    >
      <span>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 12L13 18M19 12L13 6M19 12H5"
            stroke="#FFDDA9"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>

  </div>

  <Swiper
    modules={[Navigation]}
    loop={true}
    centeredSlides={true}
    slidesPerView={"auto"}
    spaceBetween={0}
    navigation={{
      prevEl: ".orders-nav-btn--prev",
      nextEl: ".orders-nav-btn--next",
    }}
  >
    {orders.map((order) => (
      <SwiperSlide key={order.title} className={styles.slide}>
        <article className={styles.item}>
          <div className={styles.headerItem}>
            <h2>{order.title}</h2>
            <span>{order.price}</span>
          </div>
          <p>{order.description}</p>
        </article>
      </SwiperSlide>
    ))}
  </Swiper>
      </div>

        <button className={styles.checkButton}> Смотреть все заказы </button>

    </section>
  );
};

export default Orders;
