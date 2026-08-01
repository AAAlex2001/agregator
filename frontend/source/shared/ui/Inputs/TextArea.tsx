"use client";

import { useId, type ChangeEvent } from "react";
import { useFocusedField } from "./useFocusedField";
import s from "./inputs.module.scss";

export interface TextAreaProps {
  id?: string;
  name?: string;
  value: string | null | undefined;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  maxLength?: number;
  className?: string;
  error?: string;
  "aria-label"?: string;
}

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
  const areaId = id ?? generatedId;
  const { isFocused, onFocus, onBlur } = useFocusedField();

  const wrapperClass = [s.inputWrapper, s.areaWrapper, isFocused && s.focused, error && s.hasError]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`${s.field} ${className ?? ""}`}>
      <div className={wrapperClass}>
        <textarea
          id={areaId}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={rows}
          maxLength={maxLength}
          aria-label={ariaLabel}
          className={`${s.input} ${s.area}`}
        />
      </div>
      {error && <span className={s.error}>{error}</span>}
    </div>
  );
}
