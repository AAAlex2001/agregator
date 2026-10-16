"use client";

import cn from "classnames";
import { useEffect, useRef, useState } from "react";
import { Loader } from "@/shared/ui/loader";
import { useCompanySuggestions } from "../../model/use-company-suggestions";
import type { CompanySuggestion } from "../../model/types";
import styles from "./style.module.scss";

/** Текст поиска и выбранная компания; ручной ввод сбрасывает выбранные реквизиты. */
interface CompanySuggestInputProps {
  value: string;
  onChange: (query: string, company: CompanySuggestion | null) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

/** Поле поиска компании с выбором готовых реквизитов из подсказок. */
export function CompanySuggestInput({
  value,
  onChange,
  placeholder = "ИНН или название компании",
  error,
  disabled,
}: CompanySuggestInputProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const query = value.trim();
  const showDropdown = isOpen && !disabled && query.length >= 2;
  const suggestions = useCompanySuggestions(query, showDropdown);

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
      ref={rootRef}
      className={styles.outer}
    >
      <div className={styles.inputWrapper}>
        <input
          className={cn(styles.input, {
            [styles.inputError]: error,
            [styles.inputOpen]: showDropdown,
          })}
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
        <div className={styles.dropdown}>
          {suggestions === null && (
            <div className={styles.loaderBox}>
              <Loader
                size="md"
                label=""
              />
            </div>
          )}

          {suggestions?.length === 0 && (
            <div className={styles.empty}>Ничего не найдено</div>
          )}

          {suggestions && suggestions.length > 0 && (
            <ul className={styles.list}>
              {suggestions.map((company) => (
                <li
                  key={`${company.data.inn ?? company.value}-${company.data.kpp ?? ""}`}
                >
                  <button
                    type="button"
                    className={styles.option}
                    onClick={() => {
                      onChange(company.value, company);
                      setIsOpen(false);
                    }}
                  >
                    <span className={styles.name}>{company.value}</span>

                    {company.data.inn && (
                      <span className={styles.inn}>ИНН {company.data.inn}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {error && <div className={styles.errorText}>{error}</div>}
    </div>
  );
}
