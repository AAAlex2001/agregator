"use client"

import styles from "./how-it-works.module.scss";
import { useState } from "react";
import Image from "next/image";

const client = [
  {
    title: "Опишите задачу",
    description: "Разместите ТЗ на экспертизу, укажите отрасль, бюджет и сроки",
      icon: "/number_1.svg"
  },
  {
    title: "Получите отклики",
    description: "На ваш заказ откликнутся десятки экспертов с портфолио и рейтингами",
      icon: "/number_2.svg"
  },
  {
    title: "Выберите исполнителя",
    description: "Изучите рейтинг, портфолио и отзывы. Пообщайтесь в чате и выберите лучшего кандидата",
      icon: "/number_3.svg"
  },
  {
    title: "Напишите отзыв и оцените работу",
    description: "Как сделка закроется вы сможете оставить отзыв об исполнителе и поставить рейтинг",
      icon: "/number_3.svg"
  },
];


const expert = [
  {
    title: "Заполните профиль",
    description: "Укажите свои аттестации Ростехнадзора, добавьте дипломы и портфолио выполненных работ",
      icon: "/number_1.svg"
  },
  {
    title: "Найдите свой проект и участвуйте в тендере",
    description: "Используйте поиск и фильтры, чтобы найти подходящие проекты. Для подачи заявки внесите страховой взнос 5% от суммы заказа. Если выбран другой исполнитель — средства возвращаются",
      icon: "/number_2.svg"
  },
  {
    title: "Откликнитесь и обсудите",
    description: "Напишите коммерческое предложение и обсудите детали напрямую c заказчиком",
      icon: "/number_3.svg"
  },
  {
    title: "Выполните заказ, получите отзыв и оценку",
    description: "После успешного выполнения работы получите честный отзыв, который повысит ваш рейтинг в системе",
      icon: "/number_4.svg"
  },
];

const HowItWorks = () => {

    const [isExpert, setIsExpert] = useState(false);

  return (
    <section className={styles.section} id="how-it-works">
        <div className={styles.content}>
        <div className={styles.header}>
        <h1>Начните работать за 4 простых шага</h1>
        <p>
          Платформа устроена максимально прозрачно. Выбирайте свою роль:
        </p>
        </div>
            <div className={styles.stepsInfo}>
                <div className={styles.stepsTabs}></div>
      <div className={styles.steps}>
        {client.map((step) => (
          <div className={styles.step} key={step.title}>
            <div>
              <h2>{step.title}</h2>
              <p>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
                </div>
            </div>
    </section>
  );
};

export default HowItWorks;

