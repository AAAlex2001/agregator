"use client";

import styles from "./advantages.module.scss";
import Image from "next/image";
import { useState } from "react";

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
            <article 
              className={`${styles.feature} ${isOpen ? styles.featureOpen : ''}`}
              key={feature.id}
              onClick={() => toggleCard(feature.id)}
            >
              {feature.photo && (
                <div className={`${styles.featureImage} ${isOpen ? styles.visible : ''}`}>
                  <Image src={feature.photo} alt={feature.title} fill style={{ objectFit: "cover" }} />
                </div>
              )}
              <div className={styles.featureContent}>
                <div className={styles.featureHeader}>
                  {feature.icon && (
                    <Image src={feature.icon} alt={feature.title} width={40} height={40} />
                  )}
                  <h3>{feature.title}</h3>
                  <svg 
                    className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M6 9L12 15L18 9" stroke="#FFB800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className={`${styles.descriptionWrapper} ${isOpen ? styles.descriptionOpen : ''}`}>
                  <p>{feature.description}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default Advantages;