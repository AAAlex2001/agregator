import { formatPluses } from "@/source/entities/referral";
import s from "./ReferralPanel.module.scss";

interface ReferralPoolProps {
  totalPoints: number;
  remainingPoints: number;
}

/** Показывает общий призовой фонд и его текущий остаток из API. */
export function ReferralPool({ totalPoints, remainingPoints }: ReferralPoolProps) {
  return (
    <div className={s.pool}>
      <span className={s.poolLabel}>Призовой фонд</span>
      <span className={s.poolTotal}>{formatPluses(totalPoints)}</span>
      <span className={s.poolLabel}>Осталось</span>
      <strong className={s.poolRemaining}>{formatPluses(remainingPoints)}</strong>
    </div>
  );
}
