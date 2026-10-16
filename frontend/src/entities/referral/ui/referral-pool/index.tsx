import { formatPluses } from "../../model/format-pluses";
import styles from "./style.module.scss";

/** Размер фонда программы и оставшееся количество внутренних баллов. */
interface ReferralPoolProps {
  totalPoints: number;
  remainingPoints: number;
}

/** Показывает остаток призового фонда числом и полосой прогресса. */
export function ReferralPool({ totalPoints, remainingPoints }: ReferralPoolProps) {
  return (
    <div className={styles.pool}>
      <div className={styles.heading}>
        <span>Остаток призового фонда</span>
        <strong className={styles.remaining}>{formatPluses(remainingPoints)}</strong>
      </div>
      <progress
        className={styles.progress}
        value={remainingPoints}
        max={totalPoints || 1}
        aria-label="Остаток призового фонда"
      />
      <span className={styles.total}>Всего в фонде — {formatPluses(totalPoints)}</span>
    </div>
  );
}
