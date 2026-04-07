"use client";

import styles from "./statusHeader.module.scss";

interface StatusHeaderProps {
  dateLabel: string;
  date: string;
  status: string;
  statusColor: string;
  statusBg: string;
  statusMessage?: string;
  orderTitle?: string;
}

const StatusHeader = ({
  dateLabel,
  date,
  status,
  statusColor,
  statusBg,
  statusMessage,
  orderTitle,
}: StatusHeaderProps) => (
  <div className={styles.statusDateRow}>
    <div className={styles.dateRow}>
      {orderTitle ? (
        <span className={styles.orderTitle}>{orderTitle}</span>
      ) : (
        <>
          <span className={styles.dateLabel}>{dateLabel}</span>
          <span className={styles.dateValue}>{date}</span>
        </>
      )}
    </div>
    {statusMessage && (
      <span className={styles.statusMessage}>{statusMessage}</span>
    )}
    <span
      className={styles.statusBadge}
      style={{ color: statusColor, background: statusBg }}
    >
      {status}
    </span>
  </div>
);

export default StatusHeader;
