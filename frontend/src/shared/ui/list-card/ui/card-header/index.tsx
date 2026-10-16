import cn from "classnames";
import type { ReactNode } from "react";
import styles from "./style.module.scss";

/** Метаданные, статус и дополнительное содержимое строки над заголовком. */
interface CardHeaderProps {
  meta?: ReactNode;
  statusText?: string;
  statusClassName?: string;
  statusColor?: string;
  statusBg?: string;
  extra?: ReactNode;
}

/** Показывает строку метаданных, если в ней есть содержимое. */
export function CardHeader({
  meta,
  statusText,
  statusClassName,
  statusColor,
  statusBg,
  extra,
}: CardHeaderProps) {
  if (!meta && !statusText && !extra) {
    return null;
  }

  return (
    <div className={styles.headRow}>
      {meta && <span className={styles.meta}>{meta}</span>}
      {meta && statusText && (
        <span
          className={styles.divider}
          aria-hidden="true"
        >
          |
        </span>
      )}
      {statusText && (
        <span
          className={cn(styles.statusBadge, statusClassName)}
          style={{
            color: statusColor,
            background: statusBg,
          }}
        >
          {statusText}
        </span>
      )}
      {extra && <span className={styles.headerExtra}>{extra}</span>}
    </div>
  );
}
