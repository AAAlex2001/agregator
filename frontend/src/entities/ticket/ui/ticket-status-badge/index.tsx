import cn from "classnames";
import { TICKET_STATUS_LABELS } from "../../config/labels";
import type { TicketStatus } from "../../model/types";
import styles from "./style.module.scss";

/** Состояние обращения и дополнительный класс расположения. */
interface TicketStatusBadgeProps {
  status: TicketStatus;
  className?: string;
}

/** Цветная метка состояния обращения. */
export function TicketStatusBadge({ status, className }: TicketStatusBadgeProps) {
  return (
    <span className={cn(styles.badge, styles[`status_${status}`], className)}>
      {TICKET_STATUS_LABELS[status]}
    </span>
  );
}
