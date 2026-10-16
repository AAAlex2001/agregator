import classNames from "classnames";
import { getOrderBadgeColor } from "../../model/badge-color";
import type { OrderListItem } from "../../model/order-list-item";
import type { OrderBadge } from "../../model/types";
import { getOrderWorkLabel } from "../../model/work-label";
import styles from "./style.module.scss";

/** Направление заказа, текущие и прежние требования к исполнителю. */
interface OrderRequirementsProps {
  workType: OrderListItem["work_type"];
  badges: OrderBadge[];
  previousBadges: OrderBadge[] | null;
}

/** Сравнивает порядок, подписи и отображаемые цвета требований. */
function describeBadges(badges: OrderBadge[]): string {
  return badges
    .map((badge) => `${badge.text}:${getOrderBadgeColor(badge.variant)}`)
    .join("|");
}

/** Показывает вид работ или аттестации эксперта с изменениями требований. */
export function OrderRequirements({
  workType,
  badges,
  previousBadges,
}: OrderRequirementsProps) {
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

  const previous = previousBadges ?? [];
  const hasChanged = previousBadges != null
    && describeBadges(previous) !== describeBadges(badges);

  if (badges.length === 0 && previous.length === 0) {
    return null;
  }

  return (
    <div className={styles.requirements}>
      <span className={styles.label}>
        {hasChanged
          ? "Требования к исполнителю · ИЗМЕНЕНО:"
          : "Требования к исполнителю"}
      </span>
      {hasChanged && previous.length > 0 && (
        <div className={styles.previousBadges}>
          {previous.map((badge) => (
            <span
              key={badge.text}
              className={classNames(
                styles.badge,
                styles[getOrderBadgeColor(badge.variant)],
                styles.previousBadge,
              )}
            >
              {badge.text}
            </span>
          ))}
        </div>
      )}
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
