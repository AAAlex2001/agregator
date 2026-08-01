"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronIcon } from "@/source/shared/ui/icons";
import { Checkbox } from "@/source/shared/ui/Checkbox";
import s from "./MultiSelect.module.scss";

export interface MultiSelectOption {
  code: string;
  title: string;
}

interface Props {
  id: string;
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  error?: string;
}

export function MultiSelect({
  id,
  options,
  value,
  onChange,
  placeholder = "Не выбрано",
  error,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onDocumentClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", onDocumentClick);
    return () => document.removeEventListener("mousedown", onDocumentClick);
  }, [isOpen]);

  const toggle = (code: string) => {
    onChange(value.includes(code) ? value.filter((item) => item !== code) : [...value, code]);
  };

  const summary = value.length
    ? options
        .filter((option) => value.includes(option.code))
        .map((option) => option.code)
        .join(", ")
    : placeholder;

  return (
    <div className={s.root} ref={rootRef}>
      <button
        type="button"
        className={`${s.trigger} ${isOpen ? s.triggerOpen : ""} ${error ? s.triggerError : ""}`.trim()}
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
      >
        <span className={value.length ? s.summary : s.placeholder}>{summary}</span>
        <ChevronIcon className={s.chevron} color="currentColor" />
      </button>

      {isOpen && (
        <div className={s.panel} role="listbox">
          {options.map((option) => (
            <Checkbox
              key={option.code}
              id={`${id}-${option.code}`}
              checked={value.includes(option.code)}
              onChange={() => toggle(option.code)}
              className={s.option}
            >
              <span className={s.optionCode}>{option.code}</span>
              <span className={s.optionTitle}>{option.title}</span>
            </Checkbox>
          ))}
        </div>
      )}

      {error && <span className={s.error}>{error}</span>}
    </div>
  );
}
