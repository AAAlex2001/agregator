import cn from "classnames";
import { BLITZ_STATUS_TONES } from "../../config/labels";
import { blitzStatusLabel } from "../../model/status";
import type { BlitzService, BlitzStatus } from "../../model/types";
import styles from "./style.module.scss";

/** Статус заявки, сервис и кто смотрит: подписи у заказчика и исполнителя разные. */
interface BlitzStatusBadgeProps {
  status: BlitzStatus;
  service: BlitzService;
  isExpert: boolean;
}

/** Цветная метка статуса заявки. */
export function BlitzStatusBadge({ status, service, isExpert }: BlitzStatusBadgeProps) {
  return (
    <span className={cn(styles.badge, styles[BLITZ_STATUS_TONES[status]])}>
      {blitzStatusLabel(status, isExpert, service)}
    </span>
  );
}
