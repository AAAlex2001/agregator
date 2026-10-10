import type { DashboardCounter } from "../../model/types";
import styles from "./style.module.scss";

type StatCardProps = {
  title: string;
  counter: DashboardCounter;
};

/** Карточка-счётчик: всего и прирост за 7 и 30 дней. */
const StatCard = ({ title, counter }: StatCardProps) => (
  <section className={styles.card}>
    <h2 className={styles.title}>{title}</h2>
    <span className={styles.total}>{counter.total}</span>

    <div className={styles.periods}>
      <span className={styles.period}>
        <strong className={styles.growth}>+{counter.week}</strong> за 7 дней
      </span>
      <span className={styles.period}>
        <strong className={styles.growth}>+{counter.month}</strong> за 30 дней
      </span>
    </div>
  </section>
);

export default StatCard;
