import cn from "classnames";
import { BLITZ_STATUS_TONES } from "../../config/labels";
import { blitzStatusLabel } from "../../model/status";
import type { BlitzStatus } from "../../model/types";
import styles from "./style.module.scss";

/** Статус заявки и кто смотрит: подписи у заказчика и эксперта разные. */
interface BlitzStatusBadgeProps {
  status: BlitzStatus;
  isExpert: boolean;
}

/** Цветная метка статуса заявки. */
export function BlitzStatusBadge({ status, isExpert }: BlitzStatusBadgeProps) {
  return (
    <span className={cn(styles.badge, styles[BLITZ_STATUS_TONES[status]])}>
      {blitzStatusLabel(status, isExpert)}
    </span>
  );
}
