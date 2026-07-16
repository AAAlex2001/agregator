import type { Badge } from "../model/types";
import { getOrderWorkLabel, type OrderWorkType } from "../model/workTypes";
import s from "./RequirementsBadges.module.scss";

interface Props {
  badges: Badge[];
  label?: string;
  /** Если передан и отличается — над текущими badge'ами рендерим зачёркнутые предыдущие. */
  previousBadges?: Badge[] | null;
  workType?: OrderWorkType;
}

function badgesEqual(a: Badge[], b: Badge[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i].text !== b[i].text || a[i].variant !== b[i].variant) return false;
  }
  return true;
}

export function RequirementsBadges({ badges, label = "Требования к эксперту", previousBadges, workType = "EXPERTISE" }: Props) {
  if (workType === "EXPERTISE" && badges.length === 0 && (!previousBadges || previousBadges.length === 0)) {
    return null;
  }

  const changed = previousBadges != null && !badgesEqual(previousBadges, badges);

  return (
    <div className={s.requirements}>
      {workType !== "EXPERTISE" && (
        <>
          <span className={s.label}>Вид работ</span>
          <div className={s.badges}>
            <span className={`${s.badge} ${s.orange}`}>{getOrderWorkLabel(workType)}</span>
          </div>
        </>
      )}
      {workType === "EXPERTISE" && (
        <>
      <span className={s.label}>{label}{changed ? " · ИЗМЕНЕНО:" : ""}</span>
      {changed && previousBadges && previousBadges.length > 0 && (
        <div className={s.previousBadges}>
          {previousBadges.map((badge, index) => (
            <span key={`prev-${index}`} className={`${s.badge} ${s[badge.variant]} ${s.previousBadge}`}>
              {badge.text}
            </span>
          ))}
        </div>
      )}
      <div className={s.badges}>
        {badges.map((badge, index) => (
          <span key={index} className={`${s.badge} ${s[badge.variant]}`}>
            {badge.text}
          </span>
        ))}
      </div>
        </>
      )}
    </div>
  );
}
