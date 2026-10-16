"use client";

import type { FormEvent } from "react";
import { Button } from "@/shared/ui/button";
import { SearchIcon } from "@/shared/ui/icons";
import { useSearchDocuments } from "../../model/use-search-documents";
import styles from "./style.module.scss";

/** Запуск поиска, его ожидание и сброс найденного. */
interface DocumentsSearchProps {
  isSearching: boolean;
  onSearch: (query: string) => void;
  onClear: () => void;
}

/** Строка поиска нормативных документов с подсказками по мере ввода. */
export function DocumentsSearch({ isSearching, onSearch, onClear }: DocumentsSearchProps) {
  const form = useSearchDocuments(onSearch, onClear);

  /** Запускает поиск по Enter или кнопке «Найти». */
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    form.search();
  }

  return (
    <form
      className={styles.form}
      onSubmit={submit}
    >
      <div className={styles.bar}>
        <SearchIcon className={styles.icon} />
        <input
          className={styles.input}
          placeholder="Введите наименование или номер документа для поиска"
          value={form.query}
          onChange={(event) => form.changeQuery(event.target.value)}
          onFocus={form.openTips}
        />
        {form.query && (
          <button
            type="button"
            className={styles.clear}
            onClick={form.clear}
            aria-label="Очистить"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 4L12 12M12 4L4 12"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSearching}
        >
          Найти
        </Button>
      </div>

      {form.tips.length > 0 && (
        <ul className={styles.dropdown}>
          {form.tips.map((tip) => (
            <li key={`${tip.type}-${tip.value}`}>
              <button
                type="button"
                className={styles.tip}
                onClick={() => form.pickTip(tip)}
              >
                <SearchIcon className={styles.tipIcon} />
                <span>{tip.value}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
