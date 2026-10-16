"use client";

import { useReducer } from "react";
import type { FocusEvent, KeyboardEvent, RefObject } from "react";
import { useRouter } from "next/navigation";
import { useOrderSearchSuggestions } from "@/entities/order";
import { INITIAL_ORDER_SEARCH_STATE, orderSearchReducer } from "./reducer";
import { useFilterPanel } from "./use-filter-panel";

/** Управляет вводом, выбором направления и переходом к найденному заказу. */
export function useOrderSearch(
  rootRef: RefObject<HTMLDivElement | null>,
  withFilters: boolean,
) {
  const router = useRouter();
  const [state, dispatch] = useReducer(
    orderSearchReducer,
    INITIAL_ORDER_SEARCH_STATE,
  );
  const suggestions = useOrderSearchSuggestions(state.query, state.badgeCode);

  useFilterPanel(rootRef, state.filtersOpen, dispatch);

  /** Открывает общий список заказов после отправки формы. */
  function submit() {
    router.push("/orders");
  }

  /** Открывает заказ, выбранный из загруженных подсказок. */
  function pickSuggestion(id: string | number) {
    const order = suggestions.items.find((item) => item.id === Number(id));

    if (order) {
      router.push(`/order/${order.public_id}`);
    }
  }

  /** Меняет строку и возвращает выделение к началу списка подсказок. */
  function changeQuery(value: string) {
    dispatch({ type: "query/changed", value });
  }

  /** Открывает выбор области и объекта экспертизы. */
  function openFilters() {
    dispatch({ type: "filters/opened" });
  }

  /** Скрывает панель направлений без изменения выбранного кода. */
  function closeFilters() {
    dispatch({ type: "filters/closed" });
  }

  /** Скрывает подсказки после ухода фокуса из поля. */
  function closeSuggestions() {
    dispatch({ type: "suggestions/closed" });
  }

  /** Применяет выбранный код требований и закрывает панели выбора. */
  function selectFilter(code: string) {
    dispatch({ type: "filter/selected", code });
  }

  /** Снимает выбранный код требований, сохраняя строку поиска. */
  function clearFilter() {
    dispatch({ type: "filter/cleared" });
  }

  /** Выделяет подсказку при наведении или перемещении клавишами. */
  function highlightSuggestion(index: number) {
    dispatch({ type: "suggestion/highlighted", index });
  }

  /** Открывает подсказки для запроса либо выбор направления для пустого поля. */
  function focusInput(event: FocusEvent<HTMLInputElement>) {
    if (state.badgeCode || state.query.trim()) {
      dispatch({ type: "suggestions/opened" });
      return;
    }

    if (!withFilters) {
      return;
    }

    openFilters();

    if (window.matchMedia("(max-width: 767px)").matches) {
      const input = event.currentTarget;

      window.requestAnimationFrame(() => input.blur());
    }
  }

  /** Перемещает выделение подсказок и закрывает панели клавишей Escape. */
  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      highlightSuggestion(
        Math.min(state.activeSuggestion + 1, suggestions.items.length - 1),
      );
      dispatch({ type: "suggestions/opened" });
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      highlightSuggestion(Math.max(state.activeSuggestion - 1, -1));
    } else if (event.key === "Escape") {
      dispatch({ type: "panels/closed" });
    }
  }

  return {
    state,
    suggestions,
    submit,
    pickSuggestion,
    changeQuery,
    openFilters,
    closeFilters,
    closeSuggestions,
    selectFilter,
    clearFilter,
    highlightSuggestion,
    focusInput,
    handleKeyDown,
  };
}
