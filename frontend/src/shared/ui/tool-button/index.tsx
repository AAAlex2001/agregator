import cn from "classnames";
import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./style.module.scss";

/** Подпись, содержимое и действие маленькой кнопки с иконкой. */
interface ToolButtonProps {
  label: string;
  children: ReactNode;
  href?: string;
  pressed?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

/** Кнопка или ссылка с иконкой и счётчиком для панели действий. */
export function ToolButton({
  label,
  children,
  href,
  pressed,
  disabled,
  className,
  onClick,
}: ToolButtonProps) {
  if (href) {
    return (
      <Link
        className={cn(styles.tool, className)}
        aria-label={label}
        href={href}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={cn(styles.tool, className)}
      aria-label={label}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
