"use client";

import cn from "classnames";
import { useRef, type ChangeEvent, type ClipboardEvent, type KeyboardEvent } from "react";
import styles from "./otp-code-input.module.scss";

interface OtpCodeInputProps {
  value: string;
  onChange: (next: string) => void;
  length?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  error?: boolean;
}

export function OtpCodeInput({
  value,
  onChange,
  length = 6,
  disabled,
  autoFocus,
  error,
}: OtpCodeInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const buildNext = (index: number, digit: string): string => {
    const current = value.padEnd(length, " ").split("");
    current[index] = digit || " ";
    return current.join("").replace(/ +$/, "");
  };

  const handleChange = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
    const digit = e.target.value.replace(/\D/g, "").slice(-1);
    onChange(buildNext(index, digit));
    if (digit && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      refs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    onChange(pasted);
    const target = Math.min(pasted.length, length - 1);
    refs.current[target]?.focus();
  };

  const wrapperClass = cn(styles.root, { [styles.hasError]: error });

  return (
    <div className={wrapperClass}>
      {Array.from({ length }).map((_, i) => {
        const cellValue = value[i] ?? "";
        return (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className={styles.cell}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={cellValue}
            onChange={handleChange(i)}
            onKeyDown={handleKeyDown(i)}
            onPaste={handlePaste}
            disabled={disabled}
            autoFocus={autoFocus && i === 0}
          />
        );
      })}
    </div>
  );
}
