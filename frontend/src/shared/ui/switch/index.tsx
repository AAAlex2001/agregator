"use client";

import cn from "classnames";
import styles from "./style.module.scss";

/** Состояние переключателя, подписи и событие изменения значения. */
interface SwitchProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

/** Переключает логическое значение и показывает пояснение рядом с кнопкой. */
export function Switch({
  id,
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className,
}: SwitchProps) {
  /** Сообщает новое значение, если переключатель доступен. */
  function toggle() {
    if (!disabled) {
      onChange(!checked);
    }
  }

  return (
    <label
      className={cn(styles.wrapper, { [styles.disabled]: disabled }, className)}
      htmlFor={id}
    >
      <span className={styles.text}>
        {label && <span className={styles.label}>{label}</span>}
        {description && <span className={styles.description}>{description}</span>}
      </span>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        id={id}
        className={cn(styles.track, { [styles.trackOn]: checked })}
        disabled={disabled}
        onClick={toggle}
      >
        <span className={styles.thumb} />
      </button>
    </label>
  );
}
