"use client";

import Link from "next/link";
import styles from "./button.module.scss";
import { ArrowIcon } from "@/source/shared/ui/icons";
import Loader from "../Loader";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "chat"
  | "settings"
  | "outline"
  | "outlineOrange"
  | "danger"
  | "green"
  | "telegram"
  | "transparent"
  | "pill"
  | "pillMuted"
  | "pillActive"
  | "pillDisabled";
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
  href?: string;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
  scroll?: boolean;
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
  href,
  target,
  rel,
  scroll,
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

  const content = (
    <>
      {isLoading ? <Loader size="sm" label="" className={styles.inlineLoader} /> : children}
      {!isLoading && showArrow && (
        <span aria-hidden="true" className={styles.arrow}>
          <ArrowIcon />
        </span>
      )}
    </>
  );

  if (href && !disabled && !isLoading) {
    return (
      <Link href={href} className={buttonClasses} target={target} rel={rel} scroll={scroll}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
    >
      {content}
    </button>
  );
};

export default Button;
