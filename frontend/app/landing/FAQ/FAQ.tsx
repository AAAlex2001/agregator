import styles from "./faq.module.scss";

const faq = [
  {
    question: "Сколько времени занимает запуск?",
    answer:
      "Стандартные сценарии запускаются за 3-5 дней. Для сложных интеграций команда внедрения помогает подготовить архитектуру и тестирование.",
  },
  {
    question: "Можно ли подключить собственные сервисы?",
    answer:
      "Да, доступны REST API, SDK и вебхуки. Мы предоставляем примеры и шаблоны, чтобы сократить время разработки.",
  },
  {
    question: "Как обеспечивается безопасность данных?",
    answer:
      "Данные шифруются в движении и при хранении, доступ управляется ролями, ведётся журнал действий. Платформа проходит регулярные аудиты.",
  },
];

const FAQ = () => {
  return (
    <section className={styles.section} id="faq">
      <div className={styles.header}>
        <span className={styles.badge}>FAQ</span>
        <h2>Частые вопросы</h2>
      </div>
      <div className={styles.list}>
        {faq.map((item) => (
          <details className={styles.item} key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
};

export default FAQ;

