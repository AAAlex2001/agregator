import type { ReactNode } from "react";
import s from "./EmptyStateCard.module.scss";

interface EmptyStateCardProps {
  title: ReactNode;
  subtitle: ReactNode;
  actionLabel?: ReactNode;
  onAction?: () => void;
  fullPage?: boolean;
}

export function EmptyStateCard({
  title,
  subtitle,
  actionLabel,
  onAction,
  fullPage = false,
}: EmptyStateCardProps) {
  return (
    <div className={`${s.root} ${fullPage ? s.rootFullPage : ""}`.trim()}>
      <div className={s.card}>
        <div className={s.text}>
          <p className={s.title}>{title}</p>
          <p className={s.subtitle}>{subtitle}</p>
        </div>

        {actionLabel && onAction ? (
          <button type="button" className={s.action} onClick={onAction}>
            {actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}