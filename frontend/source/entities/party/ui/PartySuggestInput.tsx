"use client";

import cn from "classnames";
import { useEffect, useRef, useState } from "react";
import Loader from "@/source/shared/ui/Loader";
import { fetchPartySuggestions, type PartySuggestion } from "../api/parties.api";
import s from "./PartySuggestInput.module.scss";

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 250;

interface PartySuggestInputProps {
  value: string;
  onChange: (query: string, picked: PartySuggestion | null) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

interface SuggestionsResult {
  query: string;
  items: PartySuggestion[];
}

/** Поле компании с подсказками ДаДата: пока результата для текущего запроса нет — крутится загрузка. */
export function PartySuggestInput({ value, onChange, placeholder = "ИНН или название компании", error, disabled }: PartySuggestInputProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState<SuggestionsResult | null>(null);
  const query = value.trim();
  const showDropdown = isOpen && !disabled && query.length >= MIN_QUERY_LENGTH;
  const items = result?.query === query ? result.items : null;

  useEffect(() => {
    if (!showDropdown) return;
    let cancelled = false;
    const timer = window.setTimeout(() => {
      fetchPartySuggestions(query)
        .catch(() => [])
        .then((list) => {
          if (!cancelled) setResult({ query, items: list });
        });
    }, DEBOUNCE_MS);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query, showDropdown]);

  useEffect(() => {
    if (!isOpen) return;
    const closeOutside = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", closeOutside);
    return () => document.removeEventListener("mousedown", closeOutside);
  }, [isOpen]);

  return (
    <div ref={wrapRef} className={s.outer}>
      <div className={s.inputWrapper}>
        <input
          className={cn(s.input, { [s.inputError]: error, [s.inputOpen]: showDropdown })}
          type="text"
          value={value}
          onChange={(event) => {
            onChange(event.target.value, null);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          disabled={disabled}
        />
      </div>

      {showDropdown && (
        <div className={s.dropdown}>
          {items === null && (
            <div className={s.loaderBox}>
              <Loader size="md" label="" />
            </div>
          )}
          {items?.length === 0 && <div className={s.empty}>Ничего не найдено</div>}
          {items && items.length > 0 && (
            <ul className={s.list}>
              {items.map((party) => (
                <li key={`${party.data.inn ?? party.value}-${party.data.kpp ?? ""}`}>
                  <button
                    type="button"
                    className={s.option}
                    onClick={() => {
                      onChange(party.value, party);
                      setIsOpen(false);
                    }}
                  >
                    <span className={s.name}>{party.value}</span>
                    {party.data.inn && <span className={s.inn}>ИНН {party.data.inn}</span>}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {error && <div className={s.errorText}>{error}</div>}
    </div>
  );
}
