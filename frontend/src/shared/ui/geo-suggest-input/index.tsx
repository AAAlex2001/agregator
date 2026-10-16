"use client";

import { useEffect, useRef, useState } from "react";
import { TextInput } from "@/shared/ui/text-input";
import { useCitySuggestions } from "./model/use-city-suggestions";
import styles from "./style.module.scss";

/** Введённый город и событие его изменения. */
interface GeoSuggestInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/** Поле города с подсказками, допускающее ручной ввод без выбора из списка. */
export function GeoSuggestInput({
  value,
  onChange,
  placeholder = "Начните вводить город",
}: GeoSuggestInputProps) {
  const [query, setQuery] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const cities = useCitySuggestions(query);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    /** Закрывает подсказки при нажатии за пределами поля. */
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

  return (
    <div
      className={styles.root}
      ref={rootRef}
      onKeyDown={(event) => {
        if (event.key === "Escape" && isOpen) {
          event.preventDefault();
          event.stopPropagation();
          setIsOpen(false);
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <TextInput
        value={value}
        onChange={(event) => {
          const city = event.target.value;

          onChange(city);
          setQuery(city);
          setIsOpen(true);
        }}
        placeholder={placeholder}
        autoComplete="off"
      />

      {isOpen && query === value && cities.length > 0 && (
        <ul
          className={styles.panel}
          aria-label="Подсказки городов"
        >
          {cities.map((city) => (
            <li key={city}>
              <button
                type="button"
                className={styles.option}
                onClick={() => {
                  onChange(city);
                  setQuery(null);
                  setIsOpen(false);
                }}
              >
                {city}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
