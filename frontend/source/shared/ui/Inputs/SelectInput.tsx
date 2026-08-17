"use client";

import { useId, type ChangeEvent } from "react";
import { useFocusedField } from "./useFocusedField";
import s from "./inputs.module.scss";

export interface SelectInputOption {
  value: string;
  label: string;
}

export interface SelectInputProps {
  id?: string;
  value: string;
  options: SelectInputOption[];
  onChange: (value: string) => void;
  /** Подпись пустого значения, например «Не выбрано». */
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

export function SelectInput({
  id,
  value,
  options,
  onChange,
  placeholder = "Не выбрано",
  disabled,
  className,
  "aria-label": ariaLabel,
}: SelectInputProps) {
  const generatedId = useId();
  const { isFocused, onFocus, onBlur } = useFocusedField();

  const wrapperClass = [s.inputWrapper, isFocused && s.focused].filter(Boolean).join(" ");

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className={`${s.field} ${className ?? ""}`}>
      <div className={wrapperClass}>
        <select
          id={id ?? generatedId}
          value={value}
          onChange={handleChange}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={disabled}
          aria-label={ariaLabel}
          className={s.input}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
