import cn from "classnames";
import type { ReactNode } from "react";
import styles from "./style.module.scss";

type InputProps = {
  type?: "text" | "search" | "email" | "password" | "url";
  size?: "md" | "sm";
  name?: string;
  placeholder?: string;
  ariaLabel?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  maxLength?: number;
  autoComplete?: string;
  readOnly?: boolean;
  icon?: ReactNode;
  className?: string;
};

/** Поле ввода. Слева может стоять иконка, например лупа в поиске. */
const Input = ({
  type = "text",
  size = "md",
  name,
  placeholder,
  ariaLabel,
  value,
  onChange,
  onBlur,
  maxLength,
  autoComplete,
  readOnly,
  icon,
  className,
}: InputProps) => (
  <label className={cn(styles.field, size === "sm" && styles.small, className)}>
    {icon && <span className={styles.icon}>{icon}</span>}

    <input
      className={styles.input}
      type={type}
      name={name}
      placeholder={placeholder}
      aria-label={ariaLabel}
      value={value}
      maxLength={maxLength}
      autoComplete={autoComplete}
      readOnly={readOnly}
      onChange={(event) => onChange(event.target.value)}
      onBlur={onBlur}
    />
  </label>
);

export default Input;
