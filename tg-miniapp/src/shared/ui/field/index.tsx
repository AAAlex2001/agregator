import { type ReactNode } from "react";
import s from "./style.module.scss";

interface Props {
  label: string;
  hint?: string;
  children: ReactNode;
}

export function Field({ label, hint, children }: Props) {
  return (
    <div className={s.field}>
      <span className={s.label}>{label}</span>
      {children}
      {hint ? <span className={s.hint}>{hint}</span> : null}
    </div>
  );
}
