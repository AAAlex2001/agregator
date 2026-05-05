import { STATUS_LABEL, type TicketStatus } from "../model/types";
import s from "./StatusBadge.module.scss";

interface Props {
  status: TicketStatus;
  className?: string;
}

export function StatusBadge({ status, className = "" }: Props) {
  return (
    <span className={`${s.badge} ${s[`status_${status}`]} ${className}`.trim()}>
      {STATUS_LABEL[status]}
    </span>
  );
}
