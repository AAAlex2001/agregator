"use client";

import { forwardRef, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { LogoMarkIcon } from "@/source/shared/ui/icons";
import Button from "@/source/shared/ui/Button";
import s from "./SearchBar.module.scss";

export interface SearchBarSuggestion {
  id: string | number;
  title: string;
  subtitle?: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  buttonLabel?: string;
  suggestions?: SearchBarSuggestion[];
  activeSuggestionIndex?: number;
  onSuggestionHover?: (index: number) => void;
  onSuggestionPick?: (suggestion: SearchBarSuggestion) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  showDropdown?: boolean;
  logo?: ReactNode;
}

export const SearchBar = forwardRef<HTMLFormElement, Props>(function SearchBar(
  {
    value,
    onChange,
    onSubmit,
    placeholder,
    buttonLabel = "Найти",
    suggestions = [],
    activeSuggestionIndex = -1,
    onSuggestionHover,
    onSuggestionPick,
    onKeyDown,
    onFocus,
    onBlur,
    showDropdown = false,
    logo = <LogoMarkIcon />,
  },
  ref,
) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form ref={ref} className={s.bar} role="search" onSubmit={handleSubmit}>
      <span className={s.logo} aria-hidden="true">
        {logo}
      </span>
      <input
        type="text"
        className={s.input}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        autoComplete="off"
        aria-label={placeholder}
      />
      <Button type="submit" variant="primary" className={s.button}>
        {buttonLabel}
      </Button>

      {showDropdown && suggestions.length > 0 && (
        <ul className={s.dropdown} role="listbox">
          {suggestions.map((item, index) => (
            <li
              key={item.id}
              role="option"
              aria-selected={index === activeSuggestionIndex}
              className={`${s.item} ${index === activeSuggestionIndex ? s.itemActive : ""}`.trim()}
              onMouseDown={(e) => {
                e.preventDefault();
                onSuggestionPick?.(item);
              }}
              onMouseEnter={() => onSuggestionHover?.(index)}
            >
              <span className={s.itemTitle}>{item.title}</span>
              {item.subtitle && <span className={s.itemSubtitle}>{item.subtitle}</span>}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
});
