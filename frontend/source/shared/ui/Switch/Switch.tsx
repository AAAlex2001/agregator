"use client";

import s from "./Switch.module.scss";

interface SwitchProps {
  id?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function Switch({
  id,
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className,
}: SwitchProps) {
  const handleToggle = () => {
    if (disabled) {
      return;
    }
    onChange(!checked);
  };

  const wrapperClass = [s.wrapper, disabled ? s.disabled : "", className].filter(Boolean).join(" ");
  const trackClass = [s.track, checked ? s.trackOn : ""].filter(Boolean).join(" ");

  return (
    <label className={wrapperClass} htmlFor={id}>
      <span className={s.text}>
        {label && <span className={s.label}>{label}</span>}
        {description && <span className={s.description}>{description}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        id={id}
        className={trackClass}
        disabled={disabled}
        onClick={handleToggle}
      >
        <span className={s.thumb} />
      </button>
    </label>
  );
}
