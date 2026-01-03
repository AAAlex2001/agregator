"use client";

import styles from "./button.module.scss";
import { ArrowIcon } from "@/app/icons";

type ButtonVariant = "primary" | "secondary" | "chat";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  showArrow?: boolean;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
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
}: ButtonProps) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={buttonClasses} onClick={onClick}>
      {children}
      {showArrow && (
        <span aria-hidden="true" className={styles.arrow}>
          <ArrowIcon />
        </span>
      )}
    </button>
  );
};

export default Button;
