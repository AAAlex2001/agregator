"use client";

import styles from "./cardInput.module.scss";

interface CardInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "date" | "number";
  multiline?: boolean;
  rows?: number;
  className?: string;
}

const CardInput = ({
  value,
  onChange,
  placeholder,
  type = "text",
  multiline = false,
  rows = 4,
  className = "",
}: CardInputProps) => {
  if (multiline) {
    return (
      <textarea
        className={`${styles.input} ${styles.textarea} ${className}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
      />
    );
  }

  return (
    <input
      type={type}
      className={`${styles.input} ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
};

export default CardInput;
