"use client";

import styles from "./industry-directions.module.scss";
import Image from "next/image";
import { useState } from "react";

const industries = [
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


const IndustryDirections = () => {
  const [isHovered, setIsHovered] = useState<number | null>(null);

  return (
    <section className={styles.section} id="advantages">
        <h1 className={styles.title}>Эксперты по промбезопасности для всех отраслей промышленности</h1>
        <h2 className={styles.subtitle}>От шахт до объектов переработки. Найдите специалиста или проект в вашей сфере — мы работаем со всеми направлениями, подконтрольными Ростехнадзору</h2>
      <div className={styles.card}>
        {industries.map((industry) => (
          <article 
            className={styles.industry}
            key={industry.id}
            onMouseEnter={() => setIsHovered(industry.id)}
            onMouseLeave={() => setIsHovered(null)}
          >
            {isHovered === industry.id && industry.photo && (
              <div className={styles.industryImage}>
                <Image src={industry.photo} alt={industry.title} fill style={{ objectFit: "cover" }} />
              </div>
            )}
            <div className={styles.industryContent}>
              <div className={styles.industryHeader}>
                {industry.icon && (
                  <Image src={industry.icon} alt={industry.title} width={48} height={48} />
                )}
                <h3>{industry.title}</h3>
              </div>
              <p>{industry.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default IndustryDirections;