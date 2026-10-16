import type { ReactNode } from "react";
import { Button } from "@/shared/ui/button";
import { FileIcon } from "@/shared/ui/icons";
import styles from "./style.module.scss";

/** Сообщение пустого списка или ошибки с необязательной ссылкой или действием. */
interface EmptyStateProps {
  icon?: ReactNode;
  title: ReactNode;
  subtitle: ReactNode;
  actionLabel?: ReactNode;
  actionHref?: string;
  onAction?: () => void;
}

/** Показывает пояснение и доступное действие, когда список нельзя отобразить. */
export function EmptyState({
  icon = <FileIcon />,
  title,
  subtitle,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className={styles.root}>
      <span
        className={styles.icon}
        aria-hidden="true"
      >
        {icon}
      </span>
      <p className={styles.title}>{title}</p>
      <p className={styles.subtitle}>{subtitle}</p>
      {actionLabel && (actionHref || onAction) && (
        <Button
          href={actionHref}
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
