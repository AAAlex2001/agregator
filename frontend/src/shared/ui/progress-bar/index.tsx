import styles from "./style.module.scss";

/** Процент выполнения от 0 до 100. */
interface ProgressBarProps {
  percent: number;
}

/** Показывает ход загрузки полосой и подписью с процентом. */
export function ProgressBar({ percent }: ProgressBarProps) {
  return (
    <div
      className={styles.track}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
    >
      <div
        className={styles.fill}
        style={{ width: `${percent}%` }}
      />
      <span className={styles.text}>{percent}%</span>
    </div>
  );
}
