import { getTypingLabel } from "../../model/messages";
import type { ExpertRoomTypingUser } from "../../model/types";
import styles from "./style.module.scss";

/** Коллеги, которые сейчас набирают сообщение. */
interface TypingIndicatorProps {
  users: ExpertRoomTypingUser[];
}

/** Анимированные точки и подпись «… печатает…»; без коллег держит место под строку. */
export function TypingIndicator({ users }: TypingIndicatorProps) {
  if (users.length === 0) {
    return (
      <div
        className={styles.placeholder}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className={styles.row}
      role="status"
      aria-live="polite"
    >
      <span
        className={styles.dots}
        aria-hidden="true"
      >
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </span>
      <span className={styles.label}>{getTypingLabel(users)}</span>
    </div>
  );
}
