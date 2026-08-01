import type { ReactNode } from "react";
import s from "./FormSection.module.scss";

interface FormSectionProps {
  id?: string;
  title?: string;
  hint?: string;
  children: ReactNode;
}

export function FormSection({ id, title, hint, children }: FormSectionProps) {
  return (
    <section id={id} className={s.section}>
      {title && <h2 className={s.title}>{title}</h2>}
      {hint && <p className={s.hint}>{hint}</p>}
      {children}
    </section>
  );
}

export function FormGrid({ children }: { children: ReactNode }) {
  return <div className={s.grid}>{children}</div>;
}
