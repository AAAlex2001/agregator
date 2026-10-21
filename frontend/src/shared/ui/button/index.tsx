"use client";

import cn from "classnames";
import Link from "next/link";
import type { HTMLAttributeAnchorTarget, MouseEvent, ReactNode } from "react";
import { ArrowIcon } from "@/shared/ui/icons";
import { Loader } from "@/shared/ui/loader";
import styles from "./style.module.scss";

/** Внешние варианты кнопки; сохраняют оформление существующих экранов. */
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

/** Свойства кнопки: href включает ссылку, isLoading блокирует повторное действие. */
interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg" | "field";
  type?: "button" | "submit" | "reset";
  className?: string;
  fullWidth?: boolean;
  showArrow?: boolean;
  isActive?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  href?: string;
  target?: HTMLAttributeAnchorTarget;
  rel?: string;
  scroll?: boolean;
}

/** Кнопка действия или ссылка с общими состояниями загрузки и блокировки. */
export function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  className,
  fullWidth = false,
  showArrow = false,
  isActive = false,
  disabled = false,
  isLoading = false,
  onClick,
  href,
  target,
  rel,
  scroll,
}: ButtonProps) {
  const buttonClassName = cn(
    styles.button,
    styles[variant],
    styles[size],
    {
      [styles.fullWidth]: fullWidth,
      [styles.active]: isActive,
    },
    className,
  );

  const content = (
    <>
      {isLoading ? (
        <Loader
          size="sm"
          label=""
          className={styles.inlineLoader}
        />
      ) : (
        children
      )}

      {!isLoading && showArrow && (
        <span
          aria-hidden="true"
          className={styles.arrow}
        >
          <ArrowIcon />
        </span>
      )}
    </>
  );

  if (href && !disabled && !isLoading) {
    return (
      <Link
        href={href}
        className={buttonClassName}
        target={target}
        rel={rel}
        scroll={scroll}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={buttonClassName}
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
    >
      {content}
    </button>
  );
}
