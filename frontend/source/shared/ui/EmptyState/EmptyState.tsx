import type { ReactNode } from "react";
import Button from "../Button";
import { FileIcon } from "../icons";
import s from "./EmptyState.module.scss";

interface EmptyStateProps {
  icon?: ReactNode;
  title: ReactNode;
  subtitle: ReactNode;
  actionLabel?: ReactNode;
  actionHref?: string;
  onAction?: () => void;
}

/** Пустой список или ошибка загрузки: иконка, текст и кнопка действия — обработчик или ссылка. */
export function EmptyState({ icon = <FileIcon />, title, subtitle, actionLabel, actionHref, onAction }: EmptyStateProps) {
  return (
    <div className={s.root}>
      <span className={s.icon} aria-hidden="true">{icon}</span>
      <p className={s.title}>{title}</p>
      <p className={s.subtitle}>{subtitle}</p>
      {actionLabel && (actionHref || onAction) && (
        <Button href={actionHref} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
