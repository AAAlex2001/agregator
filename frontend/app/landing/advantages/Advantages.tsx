"use client";

import styles from "./advantages.module.scss";
import { useState } from "react";
import { Card } from "@/app/components";

const features = [
  {
    id: 1,
    title: "Аттестованные эксперты",
    description: "Специалисты всех 15 областей аттестации по Приказу Ростехнадзора. Самостоятельно выбирайте для себя подходящих экспертов",
    icon: "/icon_diploma.svg",
      photo: "/advantages_1.jpg",
  },
  {
    id: 2,
    title: "Решение за 1–2 дня",
    description: "Размещайте заказы и получайте отклики от исполнителей. Первые предложения могут поступить уже в день размещения",
    icon: "/icon_quick.svg",
      photo: "/advantages_2.jpg",
  },
  {
    id: 3,
    title: "Точечный поиск",
    description: "Ищите заказы и экспертов с фильтрами по отраслям и видам работ. Используйте возможности поиска на платформе",
    icon: "/icon_search.svg",
      photo: "/advantages_3.jpg",
  },
  {
    id: 4,
    title: "Рейтинг и отзывы",
    description: "После завершения работы заказчик ставит оценку и пишет отзыв. Так на платформе формируется репутация эксперта",
    icon: "/icon_comment.svg",
      photo: "/advantages_4.jpg",
  },
];


const Advantages = () => {
  const [openedCards, setOpenedCards] = useState<Set<number>>(new Set());

  const toggleCard = (id: number) => {
    setOpenedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <section className={styles.section} id="advantages">
      <div className={styles.card}>
        {features.map((feature) => {
          const isOpen = openedCards.has(feature.id);
          return (
            <Card
              key={feature.id}
              variant="advantage"
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              photo={feature.photo}
              isOpen={isOpen}
              onClick={() => toggleCard(feature.id)}
            />
          );
        })}
      </div>
    </section>
  );
};

export default Advantages;