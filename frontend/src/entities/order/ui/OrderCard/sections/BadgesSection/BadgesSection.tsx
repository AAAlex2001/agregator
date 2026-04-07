import type { Badge } from "../../types";
import styles from "./badgesSection.module.scss";

interface BadgesSectionProps {
  badges: Badge[];
}

export default function BadgesSection({ badges }: BadgesSectionProps) {
  return (
    <div className={styles.badges}>
      {badges.map((badge, index) => (
        <span key={index} className={`${styles.badge} ${styles[badge.variant]}`}>
          {badge.text}
        </span>
      ))}
    </div>
  );
}
