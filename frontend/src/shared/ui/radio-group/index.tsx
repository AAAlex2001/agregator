"use client";

import cn from "classnames";
import type { ReactNode } from "react";
import styles from "./style.module.scss";

/** Вариант одиночного выбора: value передаётся в onChange, label виден пользователю. */
export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  trailing?: ReactNode;
}

/** Текущий вариант и список выбора; name объединяет браузерные radio-поля. */
interface RadioGroupProps {
  name: string;
  value: string;
  options: RadioOption[];
  onChange: (value: string) => void;
  legend?: string;
  className?: string;
  variant?: "default" | "checklist";
  disabled?: boolean;
}

/** Выбор одного варианта из списка с необязательным пояснением. */
export function RadioGroup({
  name,
  value,
  options,
  onChange,
  legend,
  className,
  variant = "default",
  disabled = false,
}: RadioGroupProps) {
  return (
    <fieldset
      disabled={disabled}
      className={cn(
        styles.group,
        { [styles.checklist]: variant === "checklist" },
        className,
      )}
    >
      {legend && <legend className={styles.legend}>{legend}</legend>}

      <div className={styles.options}>
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(styles.option, {
              [styles.optionChecked]: option.value === value,
            })}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={option.value === value}
              onChange={() => onChange(option.value)}
              className={styles.input}
            />

            {variant === "checklist" ? (
              <span
                className={styles.box}
                aria-hidden="true"
              >
                <svg
                  className={styles.check}
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <path
                    d="M3 7.2L5.7 10L11 4"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            ) : (
              <span
                className={styles.indicator}
                aria-hidden="true"
              >
                <span className={styles.dot} />
              </span>
            )}

            <span className={styles.text}>
              <span className={styles.label}>{option.label}</span>

              {option.description && (
                <span className={styles.description}>{option.description}</span>
              )}
            </span>

            {option.trailing && (
              <span className={styles.trailing}>{option.trailing}</span>
            )}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
