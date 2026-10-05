import { formatBonusAmount } from "@/source/entities/referral";
import s from "./ReferralPanel.module.scss";

interface ReferralPoolProps {
  totalKopecks: number;
  remainingKopecks: number;
}

/** Показывает общий призовой фонд и его текущий остаток из API. */
export function ReferralPool({ totalKopecks, remainingKopecks }: ReferralPoolProps) {
  return (
    <div className={s.pool}>
      <span className={s.poolLabel}>Призовой фонд</span>
      <span className={s.poolTotal}>{formatBonusAmount(totalKopecks)}</span>
      <span className={s.poolLabel}>Осталось</span>
      <strong className={s.poolRemaining}>{formatBonusAmount(remainingKopecks)}</strong>
    </div>
  );
}
