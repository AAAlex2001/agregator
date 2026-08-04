"use client";

import { useEffect, useRef, useState } from "react";
import { TextInput } from "@/source/shared/ui/Inputs";
import { fetchGeoSuggest } from "@/source/shared/api/geo";
import s from "./GeoSuggestInput.module.scss";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function GeoSuggestInput({ value, onChange, placeholder = "Начните вводить город" }: Props) {
  const [options, setOptions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onDocumentClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", onDocumentClick);
    return () => document.removeEventListener("mousedown", onDocumentClick);
  }, [isOpen]);

  const requestOptions = (query: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (query.trim().length < 2) {
      setOptions([]);
      return;
    }
    timerRef.current = setTimeout(async () => {
      const points = await fetchGeoSuggest(query.trim());
      const cities = points
        .map((point) => point.city ?? point.address)
        .filter((city) => city.length > 0);
      setOptions([...new Set(cities)]);
      setIsOpen(true);
    }, 300);
  };

  const pick = (city: string) => {
    onChange(city);
    setIsOpen(false);
  };

  return (
    <div className={s.root} ref={rootRef}>
      <TextInput
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          requestOptions(event.target.value);
        }}
        placeholder={placeholder}
        autoComplete="off"
      />
      {isOpen && options.length > 0 && (
        <ul className={s.panel} role="listbox">
          {options.map((city) => (
            <li key={city}>
              <button type="button" className={s.option} onClick={() => pick(city)}>
                {city}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
