import type { ReactNode } from "react";
import styles from "./style.module.scss";

/** Содержимое метки подтверждённых данных пользователя. */
interface VerifiedBadgeProps {
  children: ReactNode;
}

/** Зелёная метка с галочкой для подтверждённой почты или ИНН. */
export function VerifiedBadge({ children }: VerifiedBadgeProps) {
  return (
    <span className={styles.badge}>
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden
      >
        <path
          d="M11.2 4.2 5.833 9.567 2.8 6.533l.933-.933 2.1 2.1 4.434-4.433.933.933Z"
          fill="currentColor"
        />
      </svg>
      {children}
    </span>
  );
}
