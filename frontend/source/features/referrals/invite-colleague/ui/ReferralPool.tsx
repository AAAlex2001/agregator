import { formatPluses } from "@/source/entities/referral";
import s from "./ReferralPanel.module.scss";

interface ReferralPoolProps {
  totalPoints: number;
  remainingPoints: number;
}

export function ReferralPool({ totalPoints, remainingPoints }: ReferralPoolProps) {
  return (
    <div className={s.pool}>
      <div className={s.poolHeading}>
        <span>Остаток призового фонда</span>
        <strong>{formatPluses(remainingPoints)}</strong>
      </div>
      <progress
        className={s.poolProgress}
        value={remainingPoints}
        max={totalPoints || 1}
        aria-label="Остаток призового фонда"
      />
      <span className={s.poolTotal}>Всего в фонде — {formatPluses(totalPoints)}</span>
    </div>
  );
}
