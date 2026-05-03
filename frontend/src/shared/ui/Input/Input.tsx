"use client";

import React, { useState, useId } from "react";
import {
  EmailIcon,
  PhoneIcon,
  EmailPhoneIcon,
  LockIcon,
  EyeOpenIcon,
  EyeClosedIcon,
} from "@/source/shared/ui/icons";
import styles from "./input.module.scss";

export type InputVariant = "text" | "email" | "phone" | "emailOrPhone" | "password" | "code";

interface InputProps {
  id?: string;
  type?: "text" | "email" | "tel" | "password" | "date";
  variant?: InputVariant;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  className?: string;
  inputClassName?: string;
  inputMode?: "text" | "email" | "tel" | "numeric";
  error?: string;
  active?: boolean;
}

const Input: React.FC<InputProps> = ({
  id,
  type,
  variant = "text",
  value,
  onChange,
  placeholder,
  required,
  disabled,
  autoComplete,
  className,
  inputClassName,
  inputMode,
  error,
  active = false,
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getInputType = (): string => {
    if (type) return type;
    
    switch (variant) {
      case "email":
        return "email";
      case "phone":
        return "tel";
      case "password":
        return showPassword ? "text" : "password";
      case "emailOrPhone":
        return "text";
      case "code":
        return "text";
      default:
        return "text";
    }
  };

  const getInputMode = (): "text" | "email" | "tel" | "numeric" | undefined => {
    if (inputMode) return inputMode;
    
    switch (variant) {
      case "email":
        return "email";
      case "phone":
        return "tel";
      case "emailOrPhone":
        return "email";
      case "code":
        return "numeric";
      default:
        return undefined;
    }
  };

  const getEmailOrPhoneType = (): "email" | "phone" | "both" => {
    if (!value.trim()) {
      return "both";
    }
    
    if (value.includes("@")) {
      return "email";
    }
    
    const phonePattern = /^[\d\s\+\-\(\)]+$/;
    if (phonePattern.test(value)) {
      return "phone";
    }
    
    return "both";
  };

  const renderLeftIcon = () => {
    switch (variant) {
      case "email":
        return <EmailIcon className={styles.iconSvg} />;
      case "phone":
        return <PhoneIcon className={styles.iconSvg} />;
      case "emailOrPhone": {
        const currentType = getEmailOrPhoneType();
        if (currentType === "email") {
          return <EmailIcon className={styles.iconSvg} />;
        } else if (currentType === "phone") {
          return <PhoneIcon className={styles.iconSvg} />;
        }
        return <EmailPhoneIcon className={styles.iconSvg} />;
      }
      case "password":
        return <LockIcon className={styles.iconSvg} dotClassName={styles.lockDot} />;
      case "code":
        return <EmailIcon className={styles.iconSvg} />;
      default:
        return null;
    }
  };

  const hasLeftIcon = variant !== "text";
  const hasRightIcon = variant === "password";
  const leftIcon = renderLeftIcon();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const emailOrPhoneType = variant === "emailOrPhone" ? getEmailOrPhoneType() : null;

  return (
    <div className={`${styles.field} ${className || ""}`}>
      <div
        className={`${styles.inputWrapper} ${isFocused ? styles.focused : ""} ${error ? styles.hasError : ""} ${active ? styles.active : ""}`}
        data-emailorphone-type={emailOrPhoneType}
      >
        {hasLeftIcon && (
          <span
            className={`${styles.iconLeft} ${styles[`icon${variant.charAt(0).toUpperCase() + variant.slice(1)}`]} ${isFocused ? styles.iconFocused : ""}`}
          >
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          type={getInputType()}
          inputMode={getInputMode()}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`${styles.input} ${hasLeftIcon ? styles.hasLeftIcon : ""} ${hasRightIcon ? styles.hasRightIcon : ""} ${inputClassName ?? ""}`}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
        />
        {hasRightIcon && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={`${styles.iconRight} ${!showPassword ? styles.closedEye : ""}`}
            aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
          >
            {showPassword ? (
              <EyeOpenIcon className={styles.eyeIcon} />
            ) : (
              <EyeClosedIcon className={styles.eyeIcon} />
            )}
          </button>
        )}
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};

export default Input;
