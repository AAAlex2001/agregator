import cn from "classnames";
import Link from "next/link";
import type { ReactNode } from "react";
import { HoverHint } from "@/shared/ui/hover-hint";
import styles from "./style.module.scss";

/** Подпись, содержимое и действие маленькой кнопки с иконкой; внешняя ссылка открывается в новой вкладке. */
interface ToolButtonProps {
  label: string;
  children: ReactNode;
  href?: string;
  external?: boolean;
  pressed?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

/** Кнопка или ссылка с иконкой и счётчиком для панели действий; подпись видна при наведении. */
export function ToolButton({
  label,
  children,
  href,
  external,
  pressed,
  disabled,
  className,
  onClick,
}: ToolButtonProps) {
  if (href && external) {
    return (
      <HoverHint label={label}>
        <a
          className={cn(styles.tool, className)}
          aria-label={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      </HoverHint>
    );
  }

  if (href) {
    return (
      <HoverHint label={label}>
        <Link
          className={cn(styles.tool, className)}
          aria-label={label}
          href={href}
        >
          {children}
        </Link>
      </HoverHint>
    );
  }

  return (
    <HoverHint label={label}>
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
    </HoverHint>
  );
}
