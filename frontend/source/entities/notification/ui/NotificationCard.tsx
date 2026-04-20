"use client";

import Button from "@/source/shared/ui/Button";
import { CloseIcon } from "@/source/shared/ui/icons";
import type { NotificationCardModel } from "../model/types";
import { formatNotificationTime } from "../model/formatters";
import s from "./NotificationCard.module.scss";

interface NotificationCardProps {
  item: NotificationCardModel;
  isActionPending?: boolean;
  isDismissPending?: boolean;
  onOpen: (id: number) => void;
  onDismiss: (id: number) => void;
}

export function NotificationCard({
  item,
  isActionPending = false,
  isDismissPending = false,
  onOpen,
  onDismiss,
}: NotificationCardProps) {
  const hasAction = Boolean(item.actionUrl && item.actionLabel);
  const cardClassName = [s.card, item.isRead ? s.read : s.unread].filter(Boolean).join(" ");

  return (
    <div className={cardClassName}>
      <div className={s.message}>
        <div className={s.titleRow}>
          <p className={s.title}>{item.title}</p>
          <button
            type="button"
            className={s.closeBtn}
            aria-label="Скрыть уведомление"
            disabled={isDismissPending}
            onClick={() => onDismiss(item.id)}
          >
            <CloseIcon />
          </button>
        </div>

        <div className={s.info}>
          <p className={s.text}>{item.message}</p>

          {hasAction ? (
            <Button
              variant="chat"
              size="sm"
              fullWidth
              className={s.actionBtn}
              isLoading={isActionPending}
              onClick={() => onOpen(item.id)}
            >
              {item.actionLabel}
            </Button>
          ) : null}

          <p className={s.time}>{formatNotificationTime(item.createdAt)}</p>
        </div>
      </div>
    </div>
  );
}