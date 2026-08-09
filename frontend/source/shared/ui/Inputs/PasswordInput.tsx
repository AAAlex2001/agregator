"use client";

import { useId, useState, type ChangeEvent } from "react";
import { LockIcon, EyeOpenIcon, EyeClosedIcon } from "@/source/shared/ui/icons";
import { useFocusedField } from "./useFocusedField";
import s from "./inputs.module.scss";

export interface PasswordInputProps {
  id?: string;
  name?: string;
  value: string | null | undefined;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  minLength?: number;
  autoComplete?: string;
  className?: string;
  error?: string;
  "aria-label"?: string;
}

export function PasswordInput({
  id,
  name,
  value,
  onChange,
  placeholder,
  disabled,
  required,
  minLength,
  autoComplete,
  className,
  error,
  "aria-label": ariaLabel,
}: PasswordInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const { isFocused, onFocus, onBlur } = useFocusedField();
  const [visible, setVisible] = useState(false);

  const wrapperClass = [s.inputWrapper, isFocused && s.focused, error && s.hasError]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`${s.field} ${className ?? ""}`}>
      <div className={wrapperClass}>
        <span className={s.iconLeft}>
          <LockIcon className={s.iconSvg} dotClassName={s.lockDot} />
        </span>
        <input
          id={inputId}
          name={name}
          type={visible ? "text" : "password"}
          value={value ?? ""}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          minLength={minLength}
          autoComplete={autoComplete}
          aria-label={ariaLabel}
          className={`${s.input} ${s.hasLeftIcon} ${s.hasRightIcon}`}
          data-lpignore="true"
          data-1p-ignore="true"
          suppressHydrationWarning
        />
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          className={`${s.iconRight} ${!visible ? s.closedEye : ""}`}
          aria-label={visible ? "Скрыть пароль" : "Показать пароль"}
        >
          {visible ? <EyeOpenIcon className={s.eyeIcon} /> : <EyeClosedIcon className={s.eyeIcon} />}
        </button>
      </div>
      {error && <span className={s.error}>{error}</span>}
    </div>
  );
}
