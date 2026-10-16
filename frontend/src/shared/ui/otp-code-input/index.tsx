"use client";

import cn from "classnames";
import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import styles from "./style.module.scss";

/** Количество цифр в коде подтверждения. */
const CODE_LENGTH = 6;

/** Введённый код и состояние поля. */
interface OtpCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  error?: boolean;
}

/** Ввод кода подтверждения по одной цифре в ячейке. */
export function OtpCodeInput({
  value,
  onChange,
  disabled,
  autoFocus,
  error,
}: OtpCodeInputProps) {
  const cellsRef = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(CODE_LENGTH).split("");

  /** Записывает цифру в ячейку и переходит к следующей. */
  function changeDigit(index: number, text: string) {
    const digit = text.replace(/\D/g, "").slice(-1);
    const nextDigits = [...digits];

    nextDigits[index] = digit || " ";
    onChange(nextDigits.join("").trimEnd());

    if (digit) {
      cellsRef.current[index + 1]?.focus();
    }
  }

  /** Возвращает курсор назад при стирании в пустой ячейке. */
  function goBack(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && digits[index] === " ") {
      cellsRef.current[index - 1]?.focus();
    }
  }

  /** Раскладывает вставленный код по ячейкам. */
  function pasteCode(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();

    const text = event.clipboardData.getData("text");
    const code = text.replace(/\D/g, "").slice(0, CODE_LENGTH);

    onChange(code);
  }

  return (
    <div
      className={cn(styles.root, {
        [styles.hasError]: error,
      })}
    >
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(cell) => {
            cellsRef.current[index] = cell;
          }}
          className={styles.cell}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={digit.trim()}
          onChange={(event) => changeDigit(index, event.target.value)}
          onKeyDown={(event) => goBack(index, event)}
          onPaste={pasteCode}
          disabled={disabled}
          autoFocus={autoFocus && index === 0}
          aria-label={`Цифра ${index + 1} из ${CODE_LENGTH}`}
        />
      ))}
    </div>
  );
}
