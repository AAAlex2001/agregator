import styles from "./hero.module.scss";

const Hero = () => {
  return (
    <section className={styles.hero} id="hero">
        <div className={styles.leftSection}>
        <h1>
          Единственная площадка для аттестованных экспертов промышленной безопасности
        </h1>
        <p>
          Размещайте заказы и находите проекты среди специалистов со всей России. Все эксперты имеют официальные аттестации Ростехнадзора
        </p>
          <button className={styles.primary}> Начать работать </button>
      </div>
      <div className={styles.visual} aria-hidden="true">
        <div className={styles.widget}>
          <span className={styles.metricLabel}>Новые источники</span>
          <span className={styles.metricValue}>+12</span>
          <span className={styles.metricSub}>за последнюю неделю</span>
        </div>
        <div className={styles.timeline}>
          <span />
          <span />
          <span />
        </div>
      </div>
    </section>
  );
};

export default Hero;

