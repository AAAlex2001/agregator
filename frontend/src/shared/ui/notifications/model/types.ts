/** Визуальный и доступный тип уведомления: успех или ошибка. */
export type NotificationTone = "success" | "error";

/** Текущее уведомление; id отличает новый показ, phase управляет появлением. */
export interface NotificationItem {
  id: number;
  tone: NotificationTone;
  message: string;
  phase: "enter" | "shown" | "exit";
}

/** Действия показа уведомлений без зависимости от конкретной бизнес-фичи. */
export interface NotificationActions {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}
