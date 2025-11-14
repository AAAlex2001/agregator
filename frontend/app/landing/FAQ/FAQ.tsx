"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./faq.module.scss";

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
  const answerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const toggle = (id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    Object.keys(answerRefs.current).forEach((id) => {
      const element = answerRefs.current[id];
      if (element) {
        if (activeId === id) {
          element.style.height = `${element.scrollHeight}px`;
        } else {
          element.style.height = "0px";
        }
      }
    });
  }, [activeId]);

  return (
    <section className={styles.section} id="faq">
      <div className={styles.content}>
        <div className={styles.header}>
          <h1>Частые вопросы</h1>
          <p>Всё, что важно знать перед началом работы</p>
        </div>
        <div className={styles.list}>
          {faq.map((item) => (
            <div
              key={item.id}
              className={`${styles.item} ${
                activeId === item.id ? styles.open : ""
              }`}
              onClick={() => toggle(item.id)}
            >
              <div className={styles.question}>
                <span>{item.question}</span>
                <svg
                  className={`${styles.icon} ${
                    activeId === item.id ? styles.open : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_1596_6718)">
                    <path
                      className={styles.verticalLine}
                      d="M10 1.5V18.5"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M1.5 10H18.5"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1596_6718">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <div
                ref={(el) => (answerRefs.current[item.id] = el)}
                className={`${styles.answer} ${
                  activeId === item.id ? styles.open : ""
                }`}
              >
                <span>{item.answer}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;

