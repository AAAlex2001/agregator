"use client";

import cn from "classnames";
import {
  useId,
  type ChangeEvent,
  type KeyboardEventHandler,
  type MouseEventHandler,
  type ReactNode,
  type Ref,
} from "react";
import { useFocusedField } from "./useFocusedField";
import s from "./inputs.module.scss";

export interface TextInputProps {
  ref?: Ref<HTMLInputElement>;
  readOnly?: boolean;
  onClick?: MouseEventHandler<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  maxLength?: number;
  id?: string;
  name?: string;
  value: string | null | undefined;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
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
  ref,
  readOnly,
  onClick,
  onKeyDown,
  maxLength,
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

  const wrapperClass = cn(s.inputWrapper, { [s.focused]: isFocused, [s.hasError]: error, [s.active]: active });

  return (
    <div className={cn(s.field, className)}>
      <div className={wrapperClass}>
        <input
          ref={ref}
          readOnly={readOnly}
          onClick={onClick}
          onKeyDown={onKeyDown}
          maxLength={maxLength}
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
          className={cn(s.input, { [s.hasRightIcon]: suffix }, inputClassName)}
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
