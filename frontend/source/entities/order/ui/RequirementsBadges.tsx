import cn from "classnames";
import type { Badge } from "../model/types";
import { getOrderWorkLabel, type OrderWorkType } from "../model/workTypes";
import s from "./RequirementsBadges.module.scss";

interface RequirementsBadgesProps {
  badges: Badge[];
  previousBadges?: Badge[] | null;
  workType?: OrderWorkType;
}

function badgesKey(badges: Badge[]): string {
  return badges.map((badge) => `${badge.text}:${badge.variant}`).join("|");
}

/**
 * Требования заказа. У направлений — вид работ, у экспертизы — коды аттестации;
 * если заказчик их поменял, сверху зачёркнуты прежние.
 */
export function RequirementsBadges({ badges, previousBadges, workType = "EXPERTISE" }: RequirementsBadgesProps) {
  if (workType !== "EXPERTISE") {
    return (
      <div className={s.requirements}>
        <span className={s.label}>Вид работ</span>
        <div className={s.badges}>
          <span className={cn(s.badge, s.orange)}>{getOrderWorkLabel(workType)}</span>
        </div>
      </div>
    );
  }

  const previous = previousBadges ?? [];
  if (badges.length === 0 && previous.length === 0) return null;
  const changed = previousBadges != null && badgesKey(previous) !== badgesKey(badges);

  return (
    <div className={s.requirements}>
      <span className={s.label}>{changed ? "Требования к исполнителю · ИЗМЕНЕНО:" : "Требования к исполнителю"}</span>
      {changed && previous.length > 0 && (
        <div className={s.previousBadges}>
          {previous.map((badge) => (
            <span key={badge.text} className={cn(s.badge, s[badge.variant], s.previousBadge)}>
              {badge.text}
            </span>
          ))}
        </div>
      )}
      <div className={s.badges}>
        {badges.map((badge) => (
          <span key={badge.text} className={cn(s.badge, s[badge.variant])}>
            {badge.text}
          </span>
        ))}
      </div>
    </div>
  );
}
