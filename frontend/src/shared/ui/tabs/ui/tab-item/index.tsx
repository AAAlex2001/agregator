import cn from "classnames";
import type { KeyboardEvent } from "react";
import styles from "./style.module.scss";

/** Одна вкладка с текущим выбором, оформлением и доступностью. */
interface TabItemProps {
  id: string;
  label: string;
  count?: number;
  isActive: boolean;
  disabled: boolean;
  variant: "squared" | "outlined" | "pill";
  onSelect: (id: string) => void;
}

/** Выбирает вкладку мышью или клавиатурой в её текущем оформлении. */
export function TabItem({
  id,
  label,
  count = 0,
  isActive,
  disabled,
  variant,
  onSelect,
}: TabItemProps) {
  /** Передаёт выбранную вкладку, если переключатель доступен. */
  function select() {
    if (!disabled) {
      onSelect(id);
    }
  }

  /** Поддерживает Enter и пробел для текстовой вкладки. */
  function selectFromKeyboard(event: KeyboardEvent<HTMLSpanElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      select();
    }
  }

  if (variant === "outlined") {
    return (
      <span
        className={cn(styles.outlined, {
          [styles.outlinedActive]: isActive,
        })}
        role="tab"
        aria-selected={isActive}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : 0}
        onClick={select}
        onKeyDown={selectFromKeyboard}
      >
        {label}
      </span>
    );
  }

  if (variant === "pill") {
    return (
      <button
        type="button"
        className={cn(styles.pill, {
          [styles.pillWithCount]: count > 0,
          [styles.pillActive]: isActive,
        })}
        aria-pressed={isActive}
        disabled={disabled}
        onClick={select}
      >
        {label}
        {count > 0 && <span className={styles.pillCount}>{count}</span>}
      </button>
    );
  }

  return (
    <button
      type="button"
      className={cn(styles.squared, {
        [styles.squaredActive]: isActive,
      })}
      aria-pressed={isActive}
      disabled={disabled}
      onClick={select}
    >
      {label}
    </button>
  );
}
