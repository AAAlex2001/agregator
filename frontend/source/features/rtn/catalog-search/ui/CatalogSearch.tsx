"use client";

import { CloseIcon, SearchIcon } from "@/source/shared/ui/icons";
import { useCatalogSearch } from "../model/useCatalogSearch";
import s from "./CatalogSearch.module.scss";

/** Поиск по заголовку или номеру документа. */
export function CatalogSearch() {
  const { value, change, clear } = useCatalogSearch();

  return (
    <div className={s.search} role="search">
      <SearchIcon className={s.icon} />
      <input
        type="text"
        className={s.input}
        value={value}
        onChange={(event) => change(event.target.value)}
        placeholder="Поиск по заголовку или номеру документа"
      />
      {value && (
        <button type="button" className={s.clear} onClick={clear} aria-label="Очистить">
          <CloseIcon />
        </button>
      )}
    </div>
  );
}
