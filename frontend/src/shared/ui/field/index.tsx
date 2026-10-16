import cn from "classnames";
import type { ReactNode } from "react";
import styles from "./style.module.scss";

/** Подпись, пояснение и содержимое поля; htmlFor связывает подпись с контролом. */
interface FieldProps {
  label: string;
  children: ReactNode;
  htmlFor?: string;
  hint?: ReactNode;
  link?: {
    href: string;
    text: string;
  };
  className?: string;
}

/** Подпись поля, подсказка и ссылка на внешний источник. */
export function Field({ label, children, htmlFor, hint, link, className }: FieldProps) {
  return (
    <div className={cn(styles.field, className)}>
      {htmlFor ? (
        <label
          className={styles.label}
          htmlFor={htmlFor}
        >
          {label}
        </label>
      ) : (
        <span className={styles.label}>{label}</span>
      )}

      {hint && <span className={styles.hint}>{hint}</span>}

      {children}

      {link && (
        <a
          className={styles.link}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {link.text}
        </a>
      )}
    </div>
  );
}
