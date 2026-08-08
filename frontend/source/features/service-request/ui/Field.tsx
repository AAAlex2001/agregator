import type { ReactNode } from "react";
import s from "./service-request-form.module.scss";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={s.field}>
      <span className={s.label}>{label}</span>
      {children}
    </div>
  );
}
