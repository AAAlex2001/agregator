import type { ChangeEvent, ReactNode } from "react";
import styles from "./checkbox.module.scss";

interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
}

export function Checkbox({
  id,
  checked,
  onChange,
  disabled,
  error,
  className = "",
  children,
}: CheckboxProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  const labelClass = `${styles.root} ${error ? styles.hasError : ""} ${className}`.trim();

  return (
    <label htmlFor={id} className={labelClass}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className={styles.input}
      />
      <span className={styles.box} aria-hidden="true">
        <svg className={styles.check} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
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
