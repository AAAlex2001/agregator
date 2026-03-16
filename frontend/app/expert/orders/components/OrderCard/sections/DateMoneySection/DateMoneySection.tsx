import styles from "./dateMoneySection.module.scss";

interface DateMoneySectionProps {
  date: string;
  sum: string;
  responsesDeadline?: string | null;
}

function formatDeadlineShort(isoString: string): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DateMoneySection({ date, sum, responsesDeadline }: DateMoneySectionProps) {
  const expired = responsesDeadline
    ? new Date(responsesDeadline) <= new Date()
    : false;

  return (
    <div className={styles.bottomWrap}>
      <div className={styles.bottom}>
        <span className={styles.date}>{date}</span>
        <div className={styles.cash}>
          <span className={styles.sum}>{sum}</span>
        </div>
      </div>
      {responsesDeadline && (
        <span className={expired ? styles.deadlineExpired : styles.deadlineActive}>
          Отклики до: {formatDeadlineShort(responsesDeadline)}
        </span>
      )}
    </div>
  );
}
