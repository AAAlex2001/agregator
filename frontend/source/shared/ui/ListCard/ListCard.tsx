import { type ReactNode } from "react";
import s from "./ListCard.module.scss";

export interface ListCardItem {
  label: ReactNode;
  value: ReactNode;
  valueAccent?: boolean;
  valueOrange?: boolean;
}

export interface ListCardProps {
  meta?: ReactNode;
  statusText?: string;
  statusColor?: string;
  statusBg?: string;
  titleLabel?: string;
  title: ReactNode;
  bottomLeftLabel?: string;
  bottomLeftValue?: ReactNode;
  /** Произвольный JSX вместо стандартной пары label+value. Перебивает bottomLeftLabel/Value. */
  bottomLeftCustom?: ReactNode;
  rightItems?: ListCardItem[];
  onClick?: () => void;
  actions?: ReactNode;
  /** Контент в левой колонке между заголовком и bottomLeft (бейджи, статус-сообщение). */
  leftExtra?: ReactNode;
  /** Контент в правом конце шапки (рядом с meta + statusBadge). */
  headerExtra?: ReactNode;
  /** Основная инфа (комментарий, файлы, документы) — показывается всегда, без дропдауна. */
  details?: ReactNode;
  /** Нижняя секция под разделительной чертой (вопросы по заказу). */
  footer?: ReactNode;
}

export function ListCard({
  meta,
  statusText,
  statusColor,
  statusBg,
  titleLabel,
  title,
  bottomLeftLabel,
  bottomLeftValue,
  bottomLeftCustom,
  rightItems,
  onClick,
  actions,
  leftExtra,
  headerExtra,
  details,
  footer,
}: ListCardProps) {
  const clickable = Boolean(onClick);

  return (
    <article
      className={`${s.card} ${clickable ? s.clickable : ""}`.trim()}
      onClick={onClick}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
    >
      <div className={s.body}>
        <div className={s.left}>
          {(meta || statusText || headerExtra) && (
            <div className={s.headRow}>
              {meta && <span className={s.meta}>{meta}</span>}
              {meta && statusText && <span className={s.divider} aria-hidden="true">|</span>}
              {statusText && (
                <span
                  className={s.statusBadge}
                  style={{ color: statusColor, background: statusBg }}
                >
                  {statusText}
                </span>
              )}
              {headerExtra && <span className={s.headerExtra}>{headerExtra}</span>}
            </div>
          )}
          <div className={s.titleBlock}>
            {titleLabel && <span className={s.label}>{titleLabel}</span>}
            <h3 className={s.title}>{title}</h3>
          </div>
          {leftExtra}
          {bottomLeftCustom ? (
            <div className={s.bottomLeft}>{bottomLeftCustom}</div>
          ) : bottomLeftLabel ? (
            <div className={s.bottomLeft}>
              <span className={s.label}>{bottomLeftLabel}</span>
              <span className={s.value}>{bottomLeftValue ?? "—"}</span>
            </div>
          ) : null}
        </div>

        {rightItems && rightItems.length > 0 && (
          <div className={s.right}>
            {rightItems.map((item, index) => (
              <div key={index} className={s.rightItem}>
                <span className={s.label}>{item.label}</span>
                <span className={[s.value, item.valueAccent ? s.valueAccent : "", item.valueOrange ? s.valueOrange : ""].filter(Boolean).join(" ")}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {actions && <div className={s.actions}>{actions}</div>}

      {details && <div className={s.details}>{details}</div>}

      {footer && <div className={s.footer}>{footer}</div>}
    </article>
  );
}
