import cn from "classnames";
import type { ReactNode } from "react";
import styles from "./style.module.scss";

/** Цветовые варианты общей подписи без привязки к предметным кодам. */
export type BadgeColor = "blue" | "orange" | "green" | "brown" | "gray";

/** Содержимое подписи и состояния выделения или выбора. */
interface BadgeProps {
  children: ReactNode;
  color: BadgeColor;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

/** Показывает цветную подпись либо кнопку выбора с тем же оформлением. */
export function Badge({
  children,
  color,
  active = false,
  disabled = false,
  onClick,
}: BadgeProps) {
  const className = cn(styles.badge, styles[color], {
    [styles.active]: active,
    [styles.disabled]: disabled,
  });

  if (!onClick) {
    return <span className={className}>{children}</span>;
  }

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}
