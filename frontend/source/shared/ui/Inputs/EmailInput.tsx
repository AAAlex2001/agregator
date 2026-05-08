"use client";

import { useId, type ChangeEvent } from "react";
import { EmailIcon } from "@/source/shared/ui/icons";
import { useFocusedField } from "./useFocusedField";
import s from "./inputs.module.scss";

export interface EmailInputProps {
  id?: string;
  name?: string;
  value: string | null | undefined;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  className?: string;
  error?: string;
  "aria-label"?: string;
}

export function EmailInput({
  id,
  name,
  value,
  onChange,
  placeholder,
  disabled,
  required,
  autoComplete,
  className,
  error,
  "aria-label": ariaLabel,
}: EmailInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const { isFocused, onFocus, onBlur } = useFocusedField();

  const wrapperClass = [s.inputWrapper, isFocused && s.focused, error && s.hasError]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`${s.field} ${className ?? ""}`}>
      <div className={wrapperClass}>
        <span className={s.iconLeft}>
          <EmailIcon className={s.iconSvg} />
        </span>
        <input
          id={inputId}
          name={name}
          type="email"
          inputMode="email"
          value={value ?? ""}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          aria-label={ariaLabel}
          className={`${s.input} ${s.hasLeftIcon}`}
          data-lpignore="true"
          data-1p-ignore="true"
          suppressHydrationWarning
        />
      </div>
      {error && <span className={s.error}>{error}</span>}
    </div>
  );
}
