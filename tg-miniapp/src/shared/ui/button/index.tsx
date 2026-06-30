import type { ButtonHTMLAttributes, ReactNode } from "react";
import cn from "classnames";
import { tapHaptic } from "@/shared/services/telegram";
import s from "./style.module.scss";

type Variant = "primary" | "outline" | "ghost";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  children: ReactNode;
}

export function Button({ variant = "primary", loading = false, children, onClick, disabled, className, ...rest }: Props) {
  return (
    <button
      className={cn(s.btn, s[variant], className)}
      disabled={disabled || loading}
      onClick={(e) => {
        tapHaptic();
        onClick?.(e);
      }}
      {...rest}
    >
      {loading ? <span className={s.spinner} /> : children}
    </button>
  );
}
