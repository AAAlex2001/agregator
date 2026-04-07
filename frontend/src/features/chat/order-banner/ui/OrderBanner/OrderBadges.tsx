import styles from "./order-badges.module.scss";

export interface OrderBadge {
  text: string;
  variant: "BLUE" | "GREEN";
}

export function OrderBadges({ badges }: { badges: OrderBadge[] }) {
  return (
    <div className={styles.badges}>
      {badges.map((badge) => {
        const variant = badge.variant === "BLUE" ? styles.blue : styles.green;
        return (
          <span key={badge.text} className={`${styles.badge} ${variant}`}>
            <span>{badge.text}</span>
          </span>
        );
      })}
    </div>
  );
}
