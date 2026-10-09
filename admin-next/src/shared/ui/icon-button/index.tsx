import cn from "classnames";
import type { ReactNode } from "react";
import Loader from "@/shared/ui/loader";
import styles from "./style.module.scss";

type IconButtonProps = {
  children: ReactNode;
  ariaLabel: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  tone?: "accent" | "outline" | "ghost" | "danger";
  size?: "md" | "sm";
  pressed?: boolean;
  className?: string;
};

/** Квадратная кнопка с иконкой или коротким текстом. pressed подсвечивает активное состояние. */
const IconButton = ({
  children,
  ariaLabel,
  onClick,
  disabled,
  loading,
  tone = "outline",
  size = "md",
  pressed,
  className,
}: IconButtonProps) => (
  <button
    type="button"
    className={cn(styles.button, styles[tone], styles[size], className)}
    aria-label={ariaLabel}
    aria-pressed={pressed}
    title={ariaLabel}
    disabled={disabled || loading}
    onClick={onClick}
  >
    {loading ? <Loader /> : children}
  </button>
);

export default IconButton;
