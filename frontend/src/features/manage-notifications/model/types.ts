/** Действие с уведомлением: прочитать или удалить. */
export type NotificationAction = "read" | "dismiss";

/** Уведомление, с которым сейчас выполняется действие. */
export interface PendingNotification {
  id: number;
  action: NotificationAction;
}
