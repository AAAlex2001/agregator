"use client";

import cn from "classnames";
import Button from "@/source/shared/ui/Button";
import { CloseIcon } from "@/source/shared/ui/icons";
import { formatNotificationTime } from "../model/formatNotificationTime";
import { toNotificationCard } from "../model/toNotificationCard";
import type { NotificationItem } from "../model/types";
import s from "./NotificationCard.module.scss";

interface NotificationCardProps {
  item: NotificationItem;
  isOpening: boolean;
  isDismissing: boolean;
  onOpen: () => void;
  onDismiss: () => void;
}

/** Карточка уведомления: заголовок, текст, кнопка перехода и время; непрочитанные подсвечены. */
export function NotificationCard({ item, isOpening, isDismissing, onOpen, onDismiss }: NotificationCardProps) {
  const text = toNotificationCard(item);

  return (
    <div className={cn(s.card, item.is_read ? s.read : s.unread)}>
      <div className={s.message}>
        <div className={s.titleRow}>
          <p className={s.title}>{text.title}</p>
          <button
            type="button"
            className={s.closeBtn}
            aria-label="Скрыть уведомление"
            disabled={isDismissing}
            onClick={onDismiss}
          >
            <CloseIcon />
          </button>
        </div>

        <div className={s.info}>
          <p className={s.text}>{text.message}</p>
          {item.action_url && (
            <Button variant="chat" size="sm" fullWidth className={s.actionBtn} isLoading={isOpening} onClick={onOpen}>
              {text.actionLabel}
            </Button>
          )}
          <p className={s.time}>{formatNotificationTime(item.created_at)}</p>
        </div>
      </div>
    </div>
  );
}
