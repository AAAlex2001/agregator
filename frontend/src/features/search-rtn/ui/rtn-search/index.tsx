"use client";

import type { ChangeEvent } from "react";
import { CloseIcon, SearchIcon } from "@/shared/ui/icons";
import { useRtnSearch } from "../../model/use-rtn-search";
import styles from "./style.module.scss";

/** Показывает поиск по заголовку или номеру документа с кнопкой очистки. */
export function RtnSearch() {
  const { value, change, clear } = useRtnSearch();

  /** Передаёт введённый текст в поиск каталога. */
  function changeSearch(event: ChangeEvent<HTMLInputElement>) {
    change(event.target.value);
  }

  return (
    <div
      className={styles.search}
      role="search"
    >
      <SearchIcon className={styles.icon} />
      <input
        type="text"
        className={styles.input}
        value={value}
        onChange={changeSearch}
        placeholder="Поиск по заголовку или номеру документа"
      />
      {value && (
        <button
          type="button"
          className={styles.clear}
          onClick={clear}
          aria-label="Очистить"
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
}
