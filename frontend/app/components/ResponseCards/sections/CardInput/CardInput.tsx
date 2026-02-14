"use client";

import styles from "./cardInput.module.scss";

interface CardInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "date" | "number";
  className?: string;
}

const CardInput = ({
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
}: CardInputProps) => (
  <input
    type={type}
    className={`${styles.input} ${className}`}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
  />
);

export default CardInput;
