import type { ReactNode } from "react";
import s from "./Field.module.scss";

interface FieldProps {
  label: string;
  hint?: string;
  link?: { href: string; text: string };
  children: ReactNode;
}

/** Поле с жирным лейблом; под контролом — подсказка и ссылка на внешний реестр, если есть. */
export function Field({ label, hint, link, children }: FieldProps) {
  return (
    <div className={s.field}>
      <span className={s.label}>{label}</span>
      {hint && <span className={s.hint}>{hint}</span>}
      {children}
      {link && (
        <a className={s.link} href={link.href} target="_blank" rel="noopener noreferrer">
          {link.text}
        </a>
      )}
    </div>
  );
}
