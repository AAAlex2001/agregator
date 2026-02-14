import styles from "./dateMoneySection.module.scss";

interface DateMoneySectionProps {
  date: string;
  sum: string;
}

export default function DateMoneySection({ date, sum }: DateMoneySectionProps) {
  return (
    <div className={styles.bottom}>
      <span className={styles.date}>{date}</span>
      <div className={styles.cash}>
        <span className={styles.sum}>{sum}</span>
      </div>
    </div>
  );
}
