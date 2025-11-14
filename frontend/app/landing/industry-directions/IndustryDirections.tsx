"use client";

import styles from "./industry-directions.module.scss";
import Image from "next/image";
import { useState } from "react";

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
      photo: "/advantages_1.jpg",
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
      photo: "/advantages_2.jpg",
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
      photo: "/advantages_3.jpg",
  },
  {
    id: 4,
    title: "ЭНЕРГЕТИКА И ОПАСНЫЕ ПРОИЗВОДСТВА",
    description: [
      "Тепло- и электроэнергетика (Э12)",
      "Взрывчатые материалы (Э3.1, Э3.2)",
      "Водоподготовка (Э9)"
    ],
      photo: "/advantages_4.jpg",
  },
  {
    id: 5,
    title: "СПЕЦИАЛЬНЫЕ ОБЪЕКТЫ",
    description: [
      "Грузоподъемные механизмы (Э14.4)"
    ],
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
                <h3>{industry.title}</h3>
              </div>
              {Array.isArray(industry.description) ? (
                <ul>
                  {industry.description.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>{industry.description}</p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default IndustryDirections;