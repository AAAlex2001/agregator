"use client";

import { useRef } from "react";
import type { OrderListItem } from "@/entities/order";
import { SearchBar } from "@/shared/ui/search-bar";
import type { SearchBarSuggestion } from "@/shared/ui/search-bar";
import { useOrderSearch } from "../../model/use-order-search";
import { ActiveFilter } from "../active-filter";
import { OrderSearchFilters } from "../order-search-filters";
import styles from "./style.module.scss";

/** Возможность выбирать экспертные требования в строке поиска заказов. */
interface OrderSearchBarProps {
  withFilters?: boolean;
}

/** Готовит название заказа и организацию для общей строки подсказок. */
function createSuggestion(order: OrderListItem): SearchBarSuggestion {
  return {
    id: order.id,
    title: order.title,
    subtitle: order.company || undefined,
  };
}

/** Ищет заказы по названию и организации с выбором экспертных требований. */
export function OrderSearchBar({ withFilters = false }: OrderSearchBarProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const search = useOrderSearch(rootRef, withFilters);
  const { state, suggestions } = search;

  /** Открывает заказ из выбранной подсказки общей строки поиска. */
  function pickSuggestion(suggestion: SearchBarSuggestion) {
    search.pickSuggestion(suggestion.id);
  }

  return (
    <div
      ref={rootRef}
      className={styles.wrap}
    >
      <SearchBar
        value={state.query}
        onChange={search.changeQuery}
        onSubmit={search.submit}
        placeholder="Найдите заказ или выберите направление"
        suggestions={suggestions.items.map(createSuggestion)}
        activeSuggestionIndex={state.activeSuggestion}
        onSuggestionHover={search.highlightSuggestion}
        onSuggestionPick={pickSuggestion}
        onKeyDown={search.handleKeyDown}
        onFocus={search.focusInput}
        onBlur={search.closeSuggestions}
        showDropdown={state.suggestionsOpen && suggestions.hasQuery}
        isLoading={suggestions.isLoading}
        emptyLabel="По вашему запросу ничего не найдено"
        loadingLabel="Ищем заказы…"
      />
      {state.badgeCode && (
        <ActiveFilter
          code={state.badgeCode}
          onOpen={search.openFilters}
          onClear={search.clearFilter}
        />
      )}
      {withFilters && state.filtersOpen && (
        <OrderSearchFilters
          onClose={search.closeFilters}
          onSelect={search.selectFilter}
        />
      )}
    </div>
  );
}
