"use client";

import cn from "classnames";
import { useId, useState, type ChangeEvent } from "react";
import { EyeClosedIcon, EyeOpenIcon, LockIcon } from "@/shared/ui/icons";
import styles from "./style.module.scss";

/** Значение пароля и ограничения ввода; видимость управляется самим полем. */
interface PasswordInputProps {
  id?: string;
  name?: string;
  value: string | null | undefined;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  minLength?: number;
  autoComplete?: string;
  className?: string;
  error?: string;
  "aria-label"?: string;
}

/** Поле пароля с переключением видимости введённого текста. */
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
  const [isFocused, setIsFocused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={cn(styles.field, className)}>
      <div
        className={cn(styles.inputWrapper, {
          [styles.focused]: isFocused,
          [styles.hasError]: error,
        })}
      >
        <span className={styles.iconLeft}>
          <LockIcon
            className={styles.iconSvg}
            dotClassName={styles.lockDot}
          />
        </span>

        <input
          id={id ?? generatedId}
          name={name}
          type={isVisible ? "text" : "password"}
          value={value ?? ""}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          minLength={minLength}
          autoComplete={autoComplete}
          aria-label={ariaLabel}
          className={cn(styles.input, styles.hasLeftIcon, styles.hasRightIcon)}
          data-lpignore="true"
          data-1p-ignore="true"
          suppressHydrationWarning
        />

        <button
          type="button"
          className={cn(styles.iconRight, {
            [styles.closedEye]: !isVisible,
          })}
          aria-label={isVisible ? "Скрыть пароль" : "Показать пароль"}
          onClick={() => setIsVisible(!isVisible)}
        >
          {isVisible ? (
            <EyeOpenIcon className={styles.eyeIcon} />
          ) : (
            <EyeClosedIcon className={styles.eyeIcon} />
          )}
        </button>
      </div>

      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
