"use client";

import { useState, type ReactNode } from "react";
import s from "./ListCard.module.scss";

export interface ListCardItem {
  label: ReactNode;
  value: ReactNode;
  valueAccent?: boolean;
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
  /** Раскрывающаяся зона деталей под двумя колонками (комментарии, файлы, вопросы). */
  details?: ReactNode;
  /** Метка кнопки раскрытия деталей. */
  detailsLabel?: string;
  /** Раскрывать ли блок деталей по умолчанию. */
  detailsOpenByDefault?: boolean;
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
  details,
  detailsLabel = "Подробнее",
  detailsOpenByDefault = false,
}: ListCardProps) {
  const [open, setOpen] = useState(detailsOpenByDefault);
  const clickable = Boolean(onClick);

  return (
    <article
      className={`${s.card} ${clickable ? s.clickable : ""}`.trim()}
      onClick={onClick}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      <div className={s.body}>
        <div className={s.left}>
          {(meta || statusText) && (
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
                <span className={`${s.value} ${item.valueAccent ? s.valueAccent : ""}`.trim()}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {actions && <div className={s.actions}>{actions}</div>}

      {details && (
        <>
          {open && <div className={s.details}>{details}</div>}
          <button
            type="button"
            className={s.detailsToggle}
            onClick={(e) => {
              e.stopPropagation();
              setOpen((prev) => !prev);
            }}
            aria-expanded={open}
          >
            <span className={s.detailsToggleLabel}>{open ? "Скрыть" : detailsLabel}</span>
            <svg
              className={`${s.chevron} ${open ? s.chevronOpen : ""}`.trim()}
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M6 9L12 15L18 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </>
      )}
    </article>
  );
}
