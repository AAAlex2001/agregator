"use client";

import cn from "classnames";
import type { ChangeEvent, FormEvent } from "react";
import { Button } from "@/shared/ui/button";
import { LogoMarkIcon } from "@/shared/ui/icons";
import { Loader } from "@/shared/ui/loader";
import type { SearchBarProps } from "./model/types";
import { SuggestionItem } from "./ui/suggestion-item";
import styles from "./style.module.scss";

/** Собирает поле поиска, кнопку отправки и управляемый список подсказок. */
export function SearchBar({
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
  isLoading = false,
  emptyLabel = "Ничего не найдено",
  loadingLabel = "Ищем…",
  logo = <LogoMarkIcon />,
}: SearchBarProps) {
  /** Передаёт запрос владельцу формы без перезагрузки страницы. */
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  /** Передаёт введённое значение владельцу поиска. */
  function changeQuery(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value);
  }

  return (
    <form
      className={cn(styles.bar, {
        [styles.barOpen]: showDropdown,
      })}
      role="search"
      onSubmit={submit}
    >
      <div className={styles.row}>
        <span
          className={styles.logo}
          aria-hidden="true"
        >
          {logo}
        </span>
        <input
          type="text"
          className={styles.input}
          value={value}
          placeholder={placeholder}
          onChange={changeQuery}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
          autoComplete="off"
          aria-label={placeholder}
        />
        <Button
          type="submit"
          variant="primary"
          className={styles.button}
        >
          {buttonLabel}
        </Button>
      </div>

      <div
        className={cn(styles.dropdown, {
          [styles.dropdownOpen]: showDropdown,
        })}
        aria-hidden={!showDropdown}
      >
        {isLoading ? (
          <div className={styles.status}>
            <Loader
              size="sm"
              label={loadingLabel}
            />
          </div>
        ) : suggestions.length === 0 ? (
          <div className={styles.status}>{emptyLabel}</div>
        ) : (
          <ul
            className={styles.list}
            role="listbox"
          >
            {suggestions.map((suggestion, index) => (
              <SuggestionItem
                key={suggestion.id}
                suggestion={suggestion}
                index={index}
                isActive={index === activeSuggestionIndex}
                onHover={onSuggestionHover}
                onPick={onSuggestionPick}
              />
            ))}
          </ul>
        )}
      </div>
    </form>
  );
}

export type { SearchBarSuggestion } from "./model/types";
