"use client";

import { useEffect, useRef, useState } from "react";
import { INN_MAX_LENGTH, normalizeInn } from "@/source/shared/lib/inn";
import s from "./InnCodeInput.module.scss";

interface InnCodeInputProps {
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

export function InnCodeInput({ value, disabled, onChange }: InnCodeInputProps) {
  const [slots, setSlots] = useState<string[]>(Array.from({ length: INN_MAX_LENGTH }, () => ""));
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    const digits = normalizeInn(value).split("");
    const nextSlots = Array.from({ length: INN_MAX_LENGTH }, (_, index) => digits[index] ?? "");
    setSlots(nextSlots);
  }, [value]);

  function commit(nextSlots: string[]) {
    setSlots(nextSlots);
    onChange(nextSlots.join(""));
  }

  function focusIndex(index: number) {
    refs.current[index]?.focus();
    refs.current[index]?.select();
  }

  function handleSingleChange(index: number, rawValue: string) {
    const digits = normalizeInn(rawValue);

    if (!digits) {
      const nextSlots = [...slots];
      nextSlots[index] = "";
      commit(nextSlots);
      return;
    }

    const nextSlots = [...slots];

    for (let offset = 0; offset < digits.length && index + offset < INN_MAX_LENGTH; offset += 1) {
      nextSlots[index + offset] = digits[offset];
    }

    commit(nextSlots);
    focusIndex(Math.min(index + digits.length, INN_MAX_LENGTH - 1));
  }

  function handleKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !slots[index] && index > 0) {
      event.preventDefault();
      const nextSlots = [...slots];
      nextSlots[index - 1] = "";
      commit(nextSlots);
      focusIndex(index - 1);
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusIndex(index - 1);
    }

    if (event.key === "ArrowRight" && index < INN_MAX_LENGTH - 1) {
      event.preventDefault();
      focusIndex(index + 1);
    }
  }

  function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const digits = normalizeInn(event.clipboardData.getData("text"));

    if (!digits) {
      return;
    }

    const nextSlots = Array.from({ length: INN_MAX_LENGTH }, (_, index) => digits[index] ?? "");
    commit(nextSlots);
    focusIndex(Math.min(digits.length, INN_MAX_LENGTH) - 1);
  }

  return (
    <div className={s.wrap}>
      <div className={s.meta}>
        <span className={s.label}>ИНН</span>
        <span className={s.hint}>10 или 12 цифр</span>
      </div>

      <div className={s.grid}>
        {slots.map((digit, index) => (
          <input
            key={index}
            ref={(node) => {
              refs.current[index] = node;
            }}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            className={s.cell}
            value={digit}
            maxLength={1}
            disabled={disabled}
            aria-label={`Цифра ИНН ${index + 1}`}
            onChange={(event) => handleSingleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={handlePaste}
            onFocus={(event) => event.currentTarget.select()}
          />
        ))}
      </div>
    </div>
  );
}