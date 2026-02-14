"use client";

import AuthHeader from "@/app/landing/header/AuthHeader";
import OrderCard from "@/app/components/OrderCard";
import type { Badge } from "@/app/components/OrderCard";
import styles from "./orders.module.scss";

interface Order {
  id: number;
  badges: Badge[];
  title: string;
  customer: string;
  date: string;
  sum: string;
}

const mockOrders: Order[] = [
  {
    id: 1,
    badges: [
      { text: "Э4 ТУ", variant: "blue" },
      { text: "Э4 ОБ", variant: "green" },
    ],
    title: "Экспертиза промышленной безопасности технических устройств",
    customer: "ООО «Ресурс Плюс»",
    date: "12.01.2026",
    sum: "150 000 ₽",
  },
  {
    id: 2,
    badges: [
      { text: "Э4 ТУ", variant: "blue" },
      { text: "Э4 ОБ", variant: "green" },
    ],
    title: "Экспертиза промышленной безопасности зданий и сооружений",
    customer: "ПАО «Газпром»",
    date: "15.01.2026",
    sum: "250 000 ₽",
  },
  {
    id: 3,
    badges: [
      { text: "Э4 ТУ", variant: "blue" },
      { text: "Э4 ОБ", variant: "green" },
    ],
    title: "Экспертиза промышленной безопасности технических устройств",
    customer: "АО «Транснефть»",
    date: "20.01.2026",
    sum: "180 000 ₽",
  },
  {
    id: 4,
    badges: [
      { text: "Э4 ТУ", variant: "blue" },
      { text: "Э4 ОБ", variant: "green" },
    ],
    title: "Экспертиза промышленной безопасности технических устройств",
    customer: "ООО «НефтеГазСервис»",
    date: "22.01.2026",
    sum: "320 000 ₽",
  },
  {
    id: 5,
    badges: [
      { text: "Э4 ТУ", variant: "blue" },
      { text: "Э4 ОБ", variant: "green" },
    ],
    title: "Экспертиза промышленной безопасности зданий и сооружений",
    customer: "ПАО «Лукойл»",
    date: "25.01.2026",
    sum: "410 000 ₽",
  },
  {
    id: 6,
    badges: [
      { text: "Э4 ТУ", variant: "blue" },
      { text: "Э4 ОБ", variant: "green" },
    ],
    title: "Экспертиза промышленной безопасности технических устройств",
    customer: "ООО «ПромЭкспертиза»",
    date: "28.01.2026",
    sum: "195 000 ₽",
  },
  {
    id: 7,
    badges: [
      { text: "Э4 ТУ", variant: "blue" },
      { text: "Э4 ОБ", variant: "green" },
    ],
    title: "Экспертиза промышленной безопасности технических устройств",
    customer: "АО «Сибур»",
    date: "01.02.2026",
    sum: "275 000 ₽",
  },
  {
    id: 8,
    badges: [
      { text: "Э4 ТУ", variant: "blue" },
      { text: "Э4 ОБ", variant: "green" },
    ],
    title: "Экспертиза промышленной безопасности зданий и сооружений",
    customer: "ООО «ТехноСервис»",
    date: "05.02.2026",
    sum: "340 000 ₽",
  },
  {
    id: 9,
    badges: [
      { text: "Э4 ТУ", variant: "blue" },
      { text: "Э4 ОБ", variant: "green" },
    ],
    title: "Экспертиза промышленной безопасности технических устройств",
    customer: "ПАО «Роснефть»",
    date: "08.02.2026",
    sum: "520 000 ₽",
  },
  {
    id: 10,
    badges: [
      { text: "Э4 ТУ", variant: "blue" },
      { text: "Э4 ОБ", variant: "green" },
    ],
    title: "Экспертиза промышленной безопасности технических устройств",
    customer: "ООО «Энергомаш»",
    date: "10.02.2026",
    sum: "165 000 ₽",
  },
  {
    id: 11,
    badges: [
      { text: "Э4 ТУ", variant: "blue" },
      { text: "Э4 ОБ", variant: "green" },
    ],
    title: "Экспертиза промышленной безопасности зданий и сооружений",
    customer: "АО «Норильский никель»",
    date: "12.02.2026",
    sum: "480 000 ₽",
  },
  {
    id: 12,
    badges: [
      { text: "Э4 ТУ", variant: "blue" },
      { text: "Э4 ОБ", variant: "green" },
    ],
    title: "Экспертиза промышленной безопасности технических устройств",
    customer: "ООО «СтройМонтаж»",
    date: "14.02.2026",
    sum: "210 000 ₽",
  },
];

export default function OrdersPage() {
  return (
    <>
      <AuthHeader
        name="Иван Иванов"
        rating={4.8}
        reviewCount={12}
        role="Эксперт"
        balance="150 000"
      />
      <div className={styles.wrapper}>
        <div className={styles.shadeLeft} />
        <div className={styles.shadeRight} />
        <div className={styles.orders}>
          {mockOrders.map((order) => (
            <OrderCard
              key={order.id}
              badges={order.badges}
              title={order.title}
              customer={order.customer}
              date={order.date}
              sum={order.sum}
            />
          ))}
        </div>
      </div>
    </>
  );
}
