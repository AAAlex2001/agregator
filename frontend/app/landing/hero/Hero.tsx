import Link from "next/link";
import styles from "./hero.module.scss";

const Hero = () => {
  return (
    <section className={styles.hero} id="hero">
      <div className={styles.content}>
        <h1>
          Автоматизируйте сбор данных
          <span>Agregator объединяет ваши сервисы в единую аналитику</span>
        </h1>
        <p>
          Настраивайте интеграции, управляйте бизнес-процессами и контролируйте показатели в одном
          месте. Платформа готова к масштабированию с первого дня.
        </p>
        <div className={styles.actions}>
          <Link className={styles.primary} href="#orders">
            Запланировать демо
          </Link>
          <Link className={styles.secondary} href="#how-it-works">
            Посмотреть процессы
          </Link>
        </div>
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

