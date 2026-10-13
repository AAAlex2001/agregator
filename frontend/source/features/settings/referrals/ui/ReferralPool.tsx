import { formatPluses } from "@/source/entities/referral";
import s from "./ReferralPool.module.scss";

interface ReferralPoolProps {
  totalPoints: number;
  remainingPoints: number;
}

/** Остаток призового фонда: сумма, полоса прогресса и общий размер фонда. */
export function ReferralPool({ totalPoints, remainingPoints }: ReferralPoolProps) {
  return (
    <div className={s.pool}>
      <div className={s.heading}>
        <span>Остаток призового фонда</span>
        <strong className={s.remaining}>{formatPluses(remainingPoints)}</strong>
      </div>
      <progress
        className={s.progress}
        value={remainingPoints}
        max={totalPoints || 1}
        aria-label="Остаток призового фонда"
      />
      <span className={s.total}>Всего в фонде — {formatPluses(totalPoints)}</span>
    </div>
  );
}
