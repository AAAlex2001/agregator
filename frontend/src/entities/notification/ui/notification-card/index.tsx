"use client";

import cn from "classnames";
import { Button } from "@/shared/ui/button";
import { CloseIcon } from "@/shared/ui/icons";
import { getNotificationText } from "../../model/notification-text";
import { formatNotificationTime } from "../../model/notification-time";
import type { NotificationItem } from "../../model/types";
import styles from "./style.module.scss";

/** Уведомление, выполняемые с ним действия и их обработчики. */
interface NotificationCardProps {
  item: NotificationItem;
  isOpening: boolean;
  isDismissing: boolean;
  onOpen: () => void;
  onDismiss: () => void;
}

/** Карточка уведомления: заголовок, текст, переход и время; непрочитанные подсвечены. */
export function NotificationCard({
  item,
  isOpening,
  isDismissing,
  onOpen,
  onDismiss,
}: NotificationCardProps) {
  const text = getNotificationText(item);

  return (
    <div className={cn(styles.card, item.is_read ? styles.read : styles.unread)}>
      <div className={styles.message}>
        <div className={styles.titleRow}>
          <p className={styles.title}>{text.title}</p>
          <button
            type="button"
            className={styles.closeButton}
            aria-label="Скрыть уведомление"
            disabled={isDismissing}
            onClick={onDismiss}
          >
            <CloseIcon />
          </button>
        </div>

        <div className={styles.info}>
          <p className={styles.text}>{text.message}</p>
          {item.action_url && (
            <Button
              variant="chat"
              size="sm"
              fullWidth
              className={styles.actionButton}
              isLoading={isOpening}
              onClick={onOpen}
            >
              {text.actionLabel}
            </Button>
          )}
          <p className={styles.time}>{formatNotificationTime(item.created_at)}</p>
        </div>
      </div>
    </div>
  );
}
