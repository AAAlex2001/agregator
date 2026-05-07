import type { Badge } from "../model/types";
import s from "./RequirementsBadges.module.scss";

interface Props {
  badges: Badge[];
  label?: string;
}

export function RequirementsBadges({ badges, label = "Требования к эксперту" }: Props) {
  if (badges.length === 0) return null;
  return (
    <div className={s.requirements}>
      <span className={s.label}>{label}</span>
      <div className={s.badges}>
        {badges.map((badge, index) => (
          <span key={index} className={`${s.badge} ${s[badge.variant]}`}>
            {badge.text}
          </span>
        ))}
      </div>
    </div>
  );
}
