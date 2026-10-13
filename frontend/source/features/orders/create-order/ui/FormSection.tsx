import type { ReactNode } from "react";
import s from "./FormSection.module.scss";

interface FormSectionProps {
  label?: ReactNode;
  children: ReactNode;
}

export function FormSection({ label, children }: FormSectionProps) {
  return (
    <section className={s.section}>
      {label && <span className={s.label}>{label}</span>}
      {children}
    </section>
  );
}
