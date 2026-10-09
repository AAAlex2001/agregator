import cn from "classnames";
import type { ReactNode } from "react";
import styles from "./style.module.scss";

type FieldProps = {
  label: string;
  children: ReactNode;
  hint?: string;
  error?: string;
  wide?: boolean;
};

/** Подпись над полем формы, подсказка под ним и текст ошибки. wide — на всю ширину сетки. */
const Field = ({ label, children, hint, error, wide }: FieldProps) => (
  <div className={cn(styles.field, wide && styles.wide)}>
    <span className={styles.label}>{label}</span>
    {children}
    {error ? <span className={styles.error}>{error}</span> : hint && <span className={styles.hint}>{hint}</span>}
  </div>
);

export default Field;
