"use client";

import styles from "./button.module.scss";
import { ArrowIcon } from "@/source/shared/ui/icons";
import Loader from "../Loader";

type ButtonVariant = "primary" | "secondary" | "chat" | "settings" | "outline" | "outlineOrange" | "green" | "transparent";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  showArrow?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
  isActive?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
}

const Button = ({
  children,
  variant = "primary",
  size = "md",
  showArrow = false,
  onClick,
  className = "",
  type = "button",
  fullWidth = false,
  isActive = false,
  disabled = false,
  isLoading = false,
}: ButtonProps) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : "",
    isActive ? styles.active : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
    >
      {isLoading ? <Loader size="sm" label="" className={styles.inlineLoader} /> : children}
      {!isLoading && showArrow && (
        <span aria-hidden="true" className={styles.arrow}>
          <ArrowIcon />
        </span>
      )}
    </button>
  );
};

export default Button;
