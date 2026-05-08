"use client";

import { useId, type ChangeEvent, type ReactNode } from "react";
import { useFocusedField } from "./useFocusedField";
import s from "./inputs.module.scss";

export interface TextInputProps {
  id?: string;
  name?: string;
  value: string | null | undefined;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  className?: string;
  inputClassName?: string;
  inputMode?: "text" | "numeric" | "decimal";
  error?: string;
  active?: boolean;
  suffix?: ReactNode;
  "aria-label"?: string;
}

export function TextInput({
  id,
  name,
  value,
  onChange,
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
  "aria-label": ariaLabel,
}: TextInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const { isFocused, onFocus, onBlur } = useFocusedField();

  const wrapperClass = [s.inputWrapper, isFocused && s.focused, error && s.hasError, active && s.active]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`${s.field} ${className ?? ""}`}>
      <div className={wrapperClass}>
        <input
          id={inputId}
          name={name}
          type="text"
          inputMode={inputMode}
          value={value ?? ""}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          aria-label={ariaLabel}
          className={`${s.input} ${suffix ? s.hasRightIcon : ""} ${inputClassName ?? ""}`}
          data-lpignore="true"
          data-1p-ignore="true"
          suppressHydrationWarning
        />
        {suffix && <span className={s.suffix}>{suffix}</span>}
      </div>
      {error && <span className={s.error}>{error}</span>}
    </div>
  );
}
