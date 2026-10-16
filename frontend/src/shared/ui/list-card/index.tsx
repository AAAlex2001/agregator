import cn from "classnames";
import type { KeyboardEvent } from "react";
import type { ListCardProps } from "./model/types";
import { CardBottomInfo } from "./ui/card-bottom-info";
import { CardHeader } from "./ui/card-header";
import { CardProperties } from "./ui/card-properties";
import styles from "./style.module.scss";

/** Собирает карточку списка с дополнительными сведениями и действиями. */
export function ListCard({
  meta,
  statusText,
  statusClassName,
  statusColor,
  statusBg,
  titleLabel,
  title,
  bottomLeftLabel,
  bottomLeftValue,
  bottomLeftCustom,
  rightItems = [],
  onClick,
  actions,
  leftExtra,
  headerExtra,
  details,
  footer,
}: ListCardProps) {
  const isClickable = Boolean(onClick);

  /** Активирует интерактивную карточку клавишей Enter или пробелом. */
  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick?.();
    }
  }

  return (
    <article
      className={cn(styles.card, {
        [styles.clickable]: isClickable,
      })}
      onClick={onClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? handleKeyDown : undefined}
    >
      <div className={styles.body}>
        <div className={styles.left}>
          <CardHeader
            meta={meta}
            statusText={statusText}
            statusClassName={statusClassName}
            statusColor={statusColor}
            statusBg={statusBg}
            extra={headerExtra}
          />
          <div className={styles.titleBlock}>
            {titleLabel && <span className={styles.label}>{titleLabel}</span>}
            <h3 className={styles.title}>{title}</h3>
          </div>
          {leftExtra}
          <CardBottomInfo
            label={bottomLeftLabel}
            value={bottomLeftValue}
            custom={bottomLeftCustom}
          />
        </div>
        <CardProperties items={rightItems} />
      </div>

      {actions && <div className={styles.actions}>{actions}</div>}
      {details && <div className={styles.details}>{details}</div>}
      {footer && <div className={styles.footer}>{footer}</div>}
    </article>
  );
}
