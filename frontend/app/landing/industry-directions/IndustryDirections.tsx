import styles from "./industry-directions.module.scss";

const directions = [
  { title: "E-commerce", description: "Собираем продажи, остатки и логи доставок в единую витрину." },
  { title: "FinTech", description: "Консолидируем данные CRM, платёжных шлюзов и скоринга в одну модель." },
  { title: "Производство", description: "Подключаем ERP, MES и складские системы для контроля производственных цепочек." },
  { title: "Маркетплейсы", description: "Агрегируем витрины, рекламные кампании и отзывы по всем площадкам." },
];

const IndustryDirections = () => {
  return (
    <section className={styles.section} id="industry-directions">
      <header className={styles.header}>
        <span className={styles.badge}>Отраслевые решения</span>
        <h2>Agregator адаптируется под специфику вашего бизнеса</h2>
        <p>Готовые коннекторы и сценарии экономят часы интеграции независимо от отрасли.</p>
      </header>
      <div className={styles.grid}>
        {directions.map((item) => (
          <article className={styles.card} key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default IndustryDirections;

