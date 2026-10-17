import classNames from "classnames";
import { getOrderBadgeColor } from "../../model/badge-color";
import type { OrderListItem } from "../../model/order-list-item";
import type { OrderBadge } from "../../model/types";
import { getOrderWorkLabel } from "../../model/work-label";
import styles from "./style.module.scss";

/** Направление заказа и требования к исполнителю. */
interface OrderRequirementsProps {
  workType: OrderListItem["work_type"];
  badges: OrderBadge[];
}

/** Показывает вид работ или аттестации эксперта. */
export function OrderRequirements({ workType, badges }: OrderRequirementsProps) {
  if (workType !== "EXPERTISE") {
    return (
      <div className={styles.requirements}>
        <span className={styles.label}>Вид работ</span>
        <div className={styles.badges}>
          <span className={classNames(styles.badge, styles.orange)}>
            {getOrderWorkLabel(workType)}
          </span>
        </div>
      </div>
    );
  }

  if (badges.length === 0) {
    return null;
  }

  return (
    <div className={styles.requirements}>
      <span className={styles.label}>Требования к исполнителю</span>
      <div className={styles.badges}>
        {badges.map((badge) => (
          <span
            key={badge.text}
            className={classNames(
              styles.badge,
              styles[getOrderBadgeColor(badge.variant)],
            )}
          >
            {badge.text}
          </span>
        ))}
      </div>
    </div>
  );
}
