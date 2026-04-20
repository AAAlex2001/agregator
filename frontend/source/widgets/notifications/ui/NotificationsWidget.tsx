"use client";

import type { RefObject } from "react";
import { NotificationCard, NotificationCardSkeleton } from "@/source/entities/notification";
import type { NotificationCardModel } from "@/source/entities/notification";
import Button from "@/source/shared/ui/Button";
import { NotificationsHeaderIcon } from "@/source/shared/ui/icons";
import s from "./NotificationsWidget.module.scss";

interface NotificationsWidgetProps {
  rootRef: RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  items: NotificationCardModel[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  pendingId: number | null;
  pendingMode: "read" | "dismiss" | null;
  isMarkingAll: boolean;
  buttonClassName?: string;
  activeClassName?: string;
  onToggle: () => void;
  onRetry: () => void | Promise<void>;
  onOpenItem: (notificationId: number) => void | Promise<void>;
  onDismissItem: (notificationId: number) => void | Promise<void>;
  onMarkAllRead: () => void | Promise<void>;
}

export function NotificationsWidget({
  rootRef,
  isOpen,
  items,
  unreadCount,
  isLoading,
  error,
  pendingId,
  pendingMode,
  isMarkingAll,
  buttonClassName,
  activeClassName,
  onToggle,
  onRetry,
  onOpenItem,
  onDismissItem,
  onMarkAllRead,
}: NotificationsWidgetProps) {
  const triggerClassName = [
    s.triggerBase,
    buttonClassName || s.triggerFallback,
    isOpen ? (activeClassName || s.triggerOpen) : "",
  ].filter(Boolean).join(" ");

  const counterLabel = unreadCount > 99 ? "+99" : `+${unreadCount}`;

  return (
    <div ref={rootRef} className={s.anchor}>
      <button
        type="button"
        className={triggerClassName}
        aria-label="Уведомления"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <NotificationsHeaderIcon />
        {unreadCount > 0 ? <span className={s.counterBadge}>{counterLabel}</span> : null}
      </button>

      {isOpen ? (
        <div className={s.panel}>
          <div className={s.head}>
            <div className={s.headCount}>
              <p className={s.headTitle}>Уведомления</p>
              <span className={s.headBadge}>{unreadCount}</span>
            </div>
          </div>

          <div className={s.content}>
            {isLoading ? (
              <div className={s.list}>
                <NotificationCardSkeleton />
                <NotificationCardSkeleton />
                <NotificationCardSkeleton />
              </div>
            ) : error ? (
              <div className={s.errorState}>
                <p className={s.errorText}>{error}</p>
                <Button variant="secondary" size="sm" onClick={() => void onRetry()}>
                  Повторить
                </Button>
              </div>
            ) : items.length === 0 ? (
              <div className={s.state}>
                <p className={s.stateText}>Здесь пока нет уведомлений</p>
              </div>
            ) : (
              <div className={s.list}>
                {items.map((item) => (
                  <NotificationCard
                    key={item.id}
                    item={item}
                    isActionPending={pendingId === item.id && pendingMode === "read"}
                    isDismissPending={pendingId === item.id && pendingMode === "dismiss"}
                    onOpen={onOpenItem}
                    onDismiss={onDismissItem}
                  />
                ))}
              </div>
            )}
          </div>

          <div className={s.footer}>
            <Button
              variant="chat"
              size="sm"
              fullWidth
              className={s.readAllBtn}
              disabled={unreadCount === 0}
              isLoading={isMarkingAll}
              onClick={() => void onMarkAllRead()}
            >
              Прочитать все
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
