"use client";

import cn from "classnames";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Checkbox } from "@/shared/ui/checkbox";
import { ChevronIcon } from "@/shared/ui/icons";
import styles from "./style.module.scss";

/** Вариант выбора: value хранится в форме и виден как код, label поясняет его. */
interface MultiSelectOption {
  value: string;
  label: string;
}

/** Выбранные коды, доступные варианты и обратный вызов изменения списка. */
interface MultiSelectProps {
  id?: string;
  label?: string;
  name?: string;
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

/** Выпадающий список с множественным выбором и отображением кодов вариантов. */
export function MultiSelect({
  id,
  label,
  name,
  options,
  value,
  onChange,
  placeholder = "Не выбрано",
  error,
  disabled = false,
}: MultiSelectProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const buttonId = inputId;
  const panelId = `${inputId}-panel`;
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const summary = options
    .filter((option) => value.includes(option.value))
    .map((option) => option.value)
    .join(", ");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    /** Закрывает список при нажатии вне его области. */
    function closeOutside(event: MouseEvent) {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", closeOutside);

    return () => {
      document.removeEventListener("mousedown", closeOutside);
    };
  }, [isOpen]);

  /** Добавляет выбранный вариант или убирает уже отмеченный. */
  function toggleOption(optionValue: string) {
    if (disabled) {
      return;
    }

    const selectedValues = value.includes(optionValue)
      ? value.filter((item) => item !== optionValue)
      : [...value, optionValue];

    onChange(selectedValues);
  }

  /** Открывает или закрывает доступный для выбора список. */
  function togglePanel() {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  }

  /** Закрывает список клавишей Escape и возвращает фокус к полю. */
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      event.stopPropagation();
      setIsOpen(false);
      buttonRef.current?.focus();
    }
  }

  return (
    <div
      className={styles.root}
      ref={rootRef}
      onKeyDown={handleKeyDown}
    >
      {label && (
        <label
          className={styles.label}
          htmlFor={buttonId}
        >
          {label}
        </label>
      )}

      <button
        id={buttonId}
        ref={buttonRef}
        name={name}
        type="button"
        disabled={disabled}
        className={cn(styles.trigger, {
          [styles.triggerOpen]: isOpen,
          [styles.triggerError]: error,
        })}
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        onClick={togglePanel}
      >
        <span className={value.length ? styles.summary : styles.placeholder}>
          {value.length ? summary : placeholder}
        </span>

        <ChevronIcon
          className={styles.chevron}
          color="currentColor"
        />
      </button>

      {isOpen && (
        <div
          id={panelId}
          className={styles.panel}
          role="group"
          aria-label={label}
        >
          {options.map((option) => (
            <Checkbox
              key={option.value}
              id={`${inputId}-${option.value}`}
              checked={value.includes(option.value)}
              disabled={disabled}
              onChange={() => toggleOption(option.value)}
              className={styles.option}
            >
              <span className={styles.optionCode}>{option.value}</span>
              <span className={styles.optionTitle}>{option.label}</span>
            </Checkbox>
          ))}
        </div>
      )}

      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
