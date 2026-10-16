"use client";

import cn from "classnames";
import {
  useId,
  useState,
  type ChangeEvent,
  type KeyboardEventHandler,
  type MouseEventHandler,
  type ReactNode,
  type Ref,
} from "react";
import styles from "./style.module.scss";

/** Значение и события текстового поля с необязательными иконкой, суффиксом и ошибкой. */
export interface TextInputProps {
  id?: string;
  name?: string;
  value: string | null | undefined;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "email" | "tel";
  ref?: Ref<HTMLInputElement>;
  readOnly?: boolean;
  onClick?: MouseEventHandler<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  maxLength?: number;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  className?: string;
  inputClassName?: string;
  inputMode?: "text" | "email" | "tel" | "numeric" | "decimal";
  error?: string;
  active?: boolean;
  suffix?: ReactNode;
  startIcon?: ReactNode;
  "aria-label"?: string;
}

/** Однострочное поле с подсказкой об ошибке, иконкой и единицей измерения. */
export function TextInput({
  id,
  name,
  value,
  onChange,
  type = "text",
  ref,
  readOnly,
  onClick,
  onKeyDown,
  maxLength,
  placeholder,
  disabled,
  required,
  autoComplete,
  className,
  inputClassName,
  inputMode,
  error,
  active = false,
  suffix,
  startIcon,
  "aria-label": ariaLabel,
}: TextInputProps) {
  const generatedId = useId();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={cn(styles.field, className)}>
      <div
        className={cn(styles.inputWrapper, {
          [styles.focused]: isFocused,
          [styles.hasError]: error,
          [styles.active]: active,
        })}
      >
        {startIcon && <span className={styles.iconLeft}>{startIcon}</span>}

        <input
          ref={ref}
          id={id ?? generatedId}
          name={name}
          type={type}
          value={value ?? ""}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          readOnly={readOnly}
          onClick={onClick}
          onKeyDown={onKeyDown}
          maxLength={maxLength}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          inputMode={inputMode}
          aria-label={ariaLabel}
          className={cn(
            styles.input,
            {
              [styles.hasLeftIcon]: startIcon,
              [styles.hasRightIcon]: suffix,
            },
            inputClassName,
          )}
          data-lpignore="true"
          data-1p-ignore="true"
          suppressHydrationWarning
        />

        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </div>

      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
