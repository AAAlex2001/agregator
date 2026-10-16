import type { ReactNode } from "react";
import styles from "./style.module.scss";

/** Подпись и контрол подполя. */
interface CellProps {
  label: string;
  children: ReactNode;
}

/** Подполе внутри группы с небольшой подписью над контролом. */
export function Cell({ label, children }: CellProps) {
  return (
    <div className={styles.cell}>
      <span className={styles.label}>{label}</span>
      {children}
    </div>
  );
}
