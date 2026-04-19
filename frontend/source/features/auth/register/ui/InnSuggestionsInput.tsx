"use client";

import { useEffect, useState } from "react";
import Input from "@/source/shared/ui/Input";
import Loader from "@/source/shared/ui/Loader";
import { normalizeInn } from "@/source/shared/lib/inn";
import { fetchPartySuggestions, type PartySuggestion } from "../api/partySuggestions.api";
import s from "./InnSuggestionsInput.module.scss";

interface InnSuggestionsInputProps {
  value: string;
  query: string;
  disabled?: boolean;
  onValueChange: (value: string) => void;
  onQueryChange: (query: string) => void;
}

export function InnSuggestionsInput({
  value,
  query,
  disabled,
  onValueChange,
  onQueryChange,
}: InnSuggestionsInputProps) {
  const [items, setItems] = useState<PartySuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const shouldShowDropdown = isOpen && (loading || items.length > 0);

  useEffect(() => {
    if (disabled || query.trim().length < 2) {
      setItems([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const timeoutId = window.setTimeout(async () => {
      setLoading(true);

      try {
        const nextItems = await fetchPartySuggestions(query.trim());
        if (!cancelled) {
          setItems(nextItems);
          setIsOpen(true);
        }
      } catch {
        if (!cancelled) {
          setItems([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [disabled, query]);

  function handleInputChange(nextQuery: string) {
    onQueryChange(nextQuery);
    onValueChange(normalizeInn(nextQuery));
    setIsOpen(true);
  }

  function handleSelect(item: PartySuggestion) {
    onQueryChange(item.value);
    onValueChange(normalizeInn(item.data.inn ?? ""));
    setIsOpen(false);
  }

  return (
    <div className={s.wrap}>
      <Input
        id="inn"
        variant="text"
        className={s.field}
        inputClassName={shouldShowDropdown ? s.inputOpen : undefined}
        value={query}
        placeholder="ИНН или название компании"
        autoComplete="off"
        disabled={disabled}
        onFocus={() => setIsOpen(true)}
        onBlur={() => {
          window.setTimeout(() => setIsOpen(false), 150);
        }}
        onChange={(event) => handleInputChange(event.target.value)}
      />

      {shouldShowDropdown ? (
        <div className={s.dropdown}>
          {loading ? (
            <div className={s.loaderState}>
              <Loader size="sm" label="" />
            </div>
          ) : (
            items.map((item) => (
              <button
                key={`${item.value}-${item.data.inn}`}
                type="button"
                className={s.option}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleSelect(item)}
              >
                <span className={s.optionTitle}>{item.value}</span>
                <span className={s.optionMeta}>ИНН {item.data.inn || "не найден"}</span>
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}