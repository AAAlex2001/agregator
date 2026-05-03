import s from "./StatusHeader.module.scss";

interface Props {
  dateLabel?: string;
  date?: string;
  status: string;
  statusColor: string;
  statusBg: string;
  statusMessage?: string;
}

export function StatusHeader({ dateLabel, date, status, statusColor, statusBg, statusMessage }: Props) {
  return (
    <div className={s.statusRow}>
      {(dateLabel || date) && (
        <div className={s.dateRow}>
          {dateLabel && <span className={s.dateLabel}>{dateLabel}</span>}
          {date && <span className={s.dateValue}>{date}</span>}
        </div>
      )}
      {statusMessage && <span className={s.statusMessage}>{statusMessage}</span>}
      <span className={s.statusBadge} style={{ color: statusColor, background: statusBg }}>
        {status}
      </span>
    </div>
  );
}
