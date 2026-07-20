"use client";

import { useRef } from "react";
import { SearchBar, type SearchBarSuggestion } from "@/source/shared/ui/SearchBar";
import { useOrderSearch } from "../model/useOrderSearch";
import { OrderSearchFilters } from "./OrderSearchFilters";
import s from "./OrderSearchBar.module.scss";

export function OrderSearchBar() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const search = useOrderSearch(rootRef);
  const { state, suggestionsState, dispatch } = search;

  const items: SearchBarSuggestion[] = suggestionsState.items.map((item) => ({
    id: item.id,
    title: item.title,
    subtitle: item.company || undefined,
  }));

  return (
    <div ref={rootRef} className={s.wrap}>
      <SearchBar
        value={state.query}
        onChange={(value) => dispatch({ type: "queryChanged", value })}
        onSubmit={search.submit}
        placeholder="Найдите заказ или выберите направление"
        suggestions={items}
        activeSuggestionIndex={state.activeSuggestion}
        onSuggestionHover={(index) => dispatch({ type: "suggestionHighlighted", index })}
        onSuggestionPick={search.submit}
        onKeyDown={search.keyDown}
        onFocus={search.focusInput}
        onBlur={() => dispatch({ type: "suggestionsClosed" })}
        showDropdown={state.suggestionsOpen && suggestionsState.hasQuery}
        isLoading={suggestionsState.isLoading}
        emptyLabel="По вашему запросу ничего не найдено"
        loadingLabel="Ищем заказы…"
      />
      {state.filterLabel ? (
        <div className={s.activeFilter}>
          <button type="button" className={s.activeFilterValue} onClick={() => dispatch({ type: "filtersOpened" })}>
            {state.filterLabel}
          </button>
          <button
            type="button"
            className={s.clearFilter}
            aria-label="Сбросить выбранное направление"
            onClick={() => dispatch({ type: "filterCleared" })}
          >
            ×
          </button>
        </div>
      ) : null}
      {state.filtersOpen && (
        <OrderSearchFilters
          onClose={() => dispatch({ type: "filtersClosed" })}
          onSelect={search.selectFilter}
        />
      )}
    </div>
  );
}
