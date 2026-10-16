"use client";

import cn from "classnames";
import type { ChangeEvent } from "react";
import styles from "./style.module.scss";

/** Значение и оформление компактного поля внутри карточки или диалога. */
interface CardInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "date" | "number";
  multiline?: boolean;
  rows?: number;
  className?: string;
}

/** Показывает однострочное или многострочное поле с общим оформлением. */
export function CardInput({
  value,
  onChange,
  placeholder,
  type = "text",
  multiline = false,
  rows = 4,
  className = "",
}: CardInputProps) {
  /** Передаёт новое значение независимо от вида поля. */
  function changeValue(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    onChange(event.target.value);
  }

  if (multiline) {
    return (
      <textarea
        className={cn(styles.input, styles.textarea, className)}
        value={value}
        onChange={changeValue}
        placeholder={placeholder}
        rows={rows}
      />
    );
  }

  return (
    <input
      type={type}
      className={cn(styles.input, className)}
      value={value}
      onChange={changeValue}
      placeholder={placeholder}
    />
  );
}
