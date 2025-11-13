import styles from "./advantages.module.scss";

const features = [
  {
    title: "Готовы к росту",
    description: "Вертикально и горизонтально масштабируемая архитектура, SLA 99.9% и резервирование.",
  },
  {
    title: "Безопасность данных",
    description: "Шифрование, контроль доступа по ролям, аудит событий и соответствие требованиям GDPR.",
  },
  {
    title: "Открытая экосистема",
    description: "API, Webhooks и расширения позволяют строить собственные приложения вокруг платформы.",
  },
  {
    title: "Поддержка 24/7",
    description: "Команда внедрения и Customer Success помогают решать задачи на каждом этапе.",
  },
];

const Advantages = () => {
  return (
    <section className={styles.section} id="advantages">
      <header className={styles.header}>
        <span className={styles.badge}>Почему мы</span>
        <h2>Платформа, созданная для сложных данных</h2>
      </header>
      <div className={styles.grid}>
        {features.map((feature) => (
          <article className={styles.feature} key={feature.title}>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Advantages;

