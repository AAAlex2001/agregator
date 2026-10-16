import cn from "classnames";
import type { NotificationItem } from "../../model/types";
import styles from "./style.module.scss";

/** Содержимое уведомления и действие его скрытия. */
interface ToastProps {
  notification: NotificationItem;
  onClose: () => void;
}

/** Короткое уведомление об успешном действии или ошибке. */
export function Toast({ notification, onClose }: ToastProps) {
  return (
    <div
      className={cn(styles.toast, styles[notification.tone], styles[notification.phase])}
      role={notification.tone === "error" ? "alert" : "status"}
    >
      <span
        className={styles.icon}
        aria-hidden="true"
      >
        {notification.tone === "success" ? "✓" : "!"}
      </span>

      <span className={styles.message}>{notification.message}</span>

      <button
        type="button"
        className={styles.close}
        onClick={onClose}
        aria-label="Закрыть уведомление"
      >
        ×
      </button>
    </div>
  );
}
