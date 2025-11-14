import styles from "./faq.module.scss";
import Image from "next/image";

const faq = [
  {
    question: "Как быстро я получу первые отклики на свой заказ?",
    answer:
      "Стандартные сценарии запускаются за 3-5 дней. Для сложных интеграций команда внедрения помогает подготовить архитектуру и тестирование.",
      icon: "/icon_plus.svg"
  },
  {
    question: "Как я могу быть уверен в квалификации эксперта?",
    answer:
      "Да, доступны REST API, SDK и вебхуки. Мы предоставляем примеры и шаблоны, чтобы сократить время разработки.",
      icon: "/icon_plus.svg"
  },
  {
    question: "Как работает система рейтинга и отзывов?",
    answer:
      "Данные шифруются в движении и при хранении, доступ управляется ролями, ведётся журнал действий. Платформа проходит регулярные аудиты.",
      icon: "/icon_plus.svg"
  },
  {
    question: "Какие комиссии на платформе?",
    answer:
      "Данные шифруются в движении и при хранении, доступ управляется ролями, ведётся журнал действий. Платформа проходит регулярные аудиты.",
      icon: "/icon_plus.svg"
  },
  {
    question: "Когда я получу оплату за выполненную работу?",
    answer:
      "Данные шифруются в движении и при хранении, доступ управляется ролями, ведётся журнал действий. Платформа проходит регулярные аудиты.",
      icon: "/icon_plus.svg"
  },
];

const FAQ = () => {
  return (
    <section className={styles.section} id="faq">
        <div className={styles.content}>
      <div className={styles.header}>
        <h1>Частые вопросы</h1>
          <p>Всё, что важно знать перед началом работы</p>
      </div>
      <div className={styles.list}>
        {faq.map((item) => (
          <details className={styles.item} key={item.question}>
            <summary>
              <span>{item.question}</span>
              {item.icon && (
                <Image src={item.icon} alt="Plus icon" width={30} height={30} />
              )}
            </summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
            </div>
    </section>
  );
};

export default FAQ;

