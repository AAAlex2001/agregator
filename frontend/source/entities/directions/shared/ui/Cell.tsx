import type { ReactNode } from "react";
import s from "./Cell.module.scss";

interface CellProps {
  label: string;
  children: ReactNode;
}

/** Подполе внутри поля: мелкий серый лейбл над контролом. */
export function Cell({ label, children }: CellProps) {
  return (
    <div className={s.cell}>
      <span className={s.label}>{label}</span>
      {children}
    </div>
  );
}
