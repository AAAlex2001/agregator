"use client";

import cn from "classnames";
import { useId, useState, type ChangeEvent } from "react";
import styles from "./style.module.scss";

/** Значение многострочного поля, его размеры и сообщение об ошибке. */
interface TextAreaProps {
  id?: string;
  name?: string;
  value: string | null | undefined;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  maxLength?: number;
  className?: string;
  error?: string;
  "aria-label"?: string;
}

/** Многострочное поле с изменяемой высотой и сообщением об ошибке. */
export function TextArea({
  id,
  name,
  value,
  onChange,
  placeholder,
  disabled,
  required,
  rows = 4,
  maxLength,
  className,
  error,
  "aria-label": ariaLabel,
}: TextAreaProps) {
  const generatedId = useId();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={cn(styles.field, className)}>
      <div
        className={cn(styles.inputWrapper, styles.areaWrapper, {
          [styles.focused]: isFocused,
          [styles.hasError]: error,
        })}
      >
        <textarea
          id={id ?? generatedId}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={rows}
          maxLength={maxLength}
          aria-label={ariaLabel}
          className={cn(styles.input, styles.area)}
        />
      </div>

      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
