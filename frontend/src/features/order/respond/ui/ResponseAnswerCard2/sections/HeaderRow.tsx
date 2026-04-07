import styles from "./sections.module.scss";

interface HeaderRowProps {
  title?: string;
  step?: string;
  dateLabel?: string;
  date?: string;
  status?: string;
  statusColor?: string;
  statusBg?: string;
}

export default function HeaderRow({ 
  title = "Отклик на заказ", 
  step = "Шаг 2. Дополнение заявки",
  dateLabel,
  date,
  status,
  statusColor,
  statusBg
}: HeaderRowProps) {
  if (dateLabel && date && status) {
    return (
      <div className={styles.headerRow}>
        <div className={styles.dateRow}>
          <span className={styles.dateLabel}>{dateLabel}</span>
          <span className={styles.dateValue}>{date}</span>
        </div>
        <span
          className={styles.statusBadge}
          style={{ color: statusColor, background: statusBg }}
        >
          {status}
        </span>
      </div>
    );
  }

  return (
    <div className={styles.headerRow}>
      <span className={styles.headerTitle}>{title}</span>
      <span className={styles.headerStep}>{step}</span>
    </div>
  );
}
