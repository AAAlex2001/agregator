"use client";

import { useState } from "react";
import styles from "./faq.module.scss";
import Image from "next/image";
import { Accordion, Title, Subtitle } from "@/app/components";

const faq = [
  {
    id: "1",
    question: "Как быстро я получу первые отклики на свой заказ?",
    answer:
      "Стандартные сценарии запускаются за 3-5 дней. Для сложных интеграций команда внедрения помогает подготовить архитектуру и тестирование.",
  },
  {
    id: "2",
    question: "Как я могу быть уверен в квалификации эксперта?",
    answer:
      "Да, доступны REST API, SDK и вебхуки. Мы предоставляем примеры и шаблоны, чтобы сократить время разработки.",
  },
  {
    id: "3",
    question: "Как работает система рейтинга и отзывов?",
    answer:
      "Данные шифруются в движении и при хранении, доступ управляется ролями, ведётся журнал действий. Платформа проходит регулярные аудиты.",
  },
  {
    id: "4",
    question: "Какие комиссии на платформе?",
    answer:
      "Данные шифруются в движении и при хранении, доступ управляется ролями, ведётся журнал действий. Платформа проходит регулярные аудиты.",
  },
  {
    id: "5",
    question: "Когда я получу оплату за выполненную работу?",
    answer:
      "Данные шифруются в движении и при хранении, доступ управляется ролями, ведётся журнал действий. Платформа проходит регулярные аудиты.",
  },
];

const FAQ = () => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  return (
    <section className={styles.section} id="faq">
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.backgroundImageCoal}>
            <Image
              src="/coal.svg"
              alt="coal"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
          <div className={styles.backgroundImageCoal}>
            <Image
              src="/gold.svg"
              alt="gold"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
          <div className={styles.backgroundImageCoal}>
            <Image
              src="/copper.svg"
              alt="cooper"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
          <Title text="Частые вопросы" />
          <Subtitle text="Всё, что важно знать перед началом работы" />
        </div>

        <Accordion items={faq} activeId={activeId} onToggle={toggle} />
      </div>
    </section>
  );
};

export default FAQ;
