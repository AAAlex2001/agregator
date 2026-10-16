import cn from "classnames";
import type { ReactNode } from "react";
import styles from "./style.module.scss";

/** Состояние флажка и подпись; onChange возвращает boolean без DOM-события. */
interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

/** Флажок с подписью; наружу передаёт выбранное состояние. */
export function Checkbox({
  id,
  checked,
  onChange,
  children,
  required,
  disabled,
  error,
  className,
}: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={cn(styles.root, { [styles.hasError]: error }, className)}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => {
          onChange(event.target.checked);
        }}
        required={required}
        disabled={disabled}
        className={styles.input}
      />

      <span
        className={styles.box}
        aria-hidden="true"
      >
        <svg
          className={styles.check}
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 7.2L5.7 10L11 4"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <span className={styles.label}>{children}</span>
    </label>
  );
}
