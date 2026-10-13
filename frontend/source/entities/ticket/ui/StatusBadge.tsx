import cn from "classnames";
import { STATUS_LABEL, type TicketStatus } from "../model/types";
import s from "./StatusBadge.module.scss";

interface StatusBadgeProps {
  status: TicketStatus;
  className?: string;
}

/** Цветная метка статуса обращения. */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  return <span className={cn(s.badge, s[`status_${status}`], className)}>{STATUS_LABEL[status]}</span>;
}
