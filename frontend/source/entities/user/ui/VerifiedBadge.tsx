import type { ReactNode } from "react";
import s from "./VerifiedBadge.module.scss";

interface VerifiedBadgeProps {
  children: ReactNode;
}

/** Зелёная метка с галочкой: «Почта подтверждена», «ИНН подтверждён». */
export function VerifiedBadge({ children }: VerifiedBadgeProps) {
  return (
    <span className={s.badge}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <path
          d="M11.2 4.2 5.833 9.567 2.8 6.533l.933-.933 2.1 2.1 4.434-4.433.933.933Z"
          fill="currentColor"
        />
      </svg>
      {children}
    </span>
  );
}
