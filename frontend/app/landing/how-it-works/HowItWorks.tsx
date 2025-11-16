"use client"

import styles from "./how-it-works.module.scss";
import { useState } from "react";
import Image from "next/image";

const client = [
  {
      id: 1,
    title: "Опишите задачу",
    description: "Разместите ТЗ на экспертизу, укажите отрасль, бюджет и сроки",
      icon: "/number_1.svg"
  },
    {
      id: 2,
    title: "Выберите исполнителя",
    description: "Изучите рейтинг, портфолио и отзывы. Пообщайтесь в чате и выберите лучшего кандидата",
      icon: "/number_3.svg"
  },
  {
      id: 3,
    title: "Получите отклики",
    description: "На ваш заказ откликнутся десятки экспертов с портфолио и рейтингами",
      icon: "/number_2.svg"
  },
  {
      id: 4,
    title: "Напишите отзыв и оцените работу",
    description: "Как сделка закроется вы сможете оставить отзыв об исполнителе и поставить рейтинг",
      icon: "/number_4.svg"
  },
];


const expert = [
  {
      id: 1,
    title: "Заполните профиль",
    description: "Укажите свои области аккредитации экспертов в области промышленной безопасности",
      icon: "/number_1.svg"
  },
  {
      id: 2,
    title: "Откликнитесь и обсудите",
    description: "Напишите коммерческое предложение и обсудите детали напрямую c заказчиком",
      icon: "/number_3.svg"
  },
    {
      id: 3,
    title: "Найдите свой проект и участвуйте в тендере",
    description: "Используйте поиск и фильтры, чтобы найти подходящие проекты. Для подачи заявки внесите страховой взнос 5% от суммы заказа. Если выбран другой исполнитель — средства возвращаются",
      icon: "/number_2.svg"
  },
  {
      id: 4,
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
                <div className={styles.backgroundImage}>
        <Image src="/belaz.svg" alt="Industry background" fill style={{ objectFit: "contain" }} />
      </div>

                <div className={styles.backgroundImageCoal}>
        <Image src="/coal.svg" alt="coal" fill style={{ objectFit: "contain" }} />
      </div>

                <div className={styles.backgroundImageCoal}>
        <Image src="/coal.svg" alt="coal" fill style={{ objectFit: "contain" }} />
      </div>

                <div className={styles.backgroundImageCoal}>
        <Image src="/coal.svg" alt="coal" fill style={{ objectFit: "contain" }} />
      </div>

                <div className={styles.backgroundImageCoal}>
        <Image src="/coal.svg" alt="coal" fill style={{ objectFit: "contain" }} />
      </div>

                <div className={styles.backgroundImageCoal}>
        <Image src="/coal.svg" alt="coal" fill style={{ objectFit: "contain" }} />
      </div>

            <h1>Начните работать за 4 простых шага</h1>
            <p>
              Платформа устроена максимально прозрачно. Выбирайте свою роль:
            </p>
            </div>
                <div className={styles.stepsInfo}>
                        <div className={styles.stepsTabs}>
                            <span className={!isExpert ? styles.active : ''} onClick={() => setIsExpert(false)}>Я заказчик</span>
                            <span className={isExpert ? styles.active : ''} onClick={() => setIsExpert(true)}>Я эксперт</span>
                        </div>
              <div className={styles.steps}>
                {(isExpert ? expert : client).map((value) => (
                  <div className={styles.step} key={`${isExpert ? 'expert' : 'client'}-${value.id}`}>
                    <div className={styles.iconWrapper}>
                      <img src={value.icon} alt={value.title} />
                    </div>
                    <div className={styles.description}>
                      <h2>{value.title}</h2>
                      <p>{value.description}</p>
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

