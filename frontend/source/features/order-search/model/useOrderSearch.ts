"use client";

import { useEffect, useReducer, type FocusEvent, type KeyboardEvent, type RefObject } from "react";
import { useRouter } from "next/navigation";
import type { PublicOrderSearchFilters } from "@/source/entities/order";
import { initialSearchBarState, searchBarReducer } from "./searchBarReducer";
import { useOrderSearchSuggestions } from "./useOrderSearchSuggestions";

export function useOrderSearch(rootRef: RefObject<HTMLDivElement | null>) {
  const router = useRouter();
  const [state, dispatch] = useReducer(searchBarReducer, initialSearchBarState);
  const suggestionsState = useOrderSearchSuggestions({ query: state.query, filters: state.filters });

  useEffect(() => {
    if (!state.filtersOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        dispatch({ type: "filtersClosed" });
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [state.filtersOpen, rootRef]);

  useEffect(() => {
    if (!state.filtersOpen || !window.matchMedia("(max-width: 767px)").matches) return;

    const body = document.body;
    const root = document.documentElement;
    const previous = {
      bodyOverflow: body.style.overflow,
      rootOverflow: root.style.overflow,
    };

    root.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      root.style.overflow = previous.rootOverflow;
      body.style.overflow = previous.bodyOverflow;
    };
  }, [state.filtersOpen]);

  const submit = () => {
    dispatch({ type: "closed" });
    const params = new URLSearchParams();
    const query = state.query.trim();
    if (query) params.set("q", query);
    if (state.filters.workType) params.set("work_type", state.filters.workType);
    if (state.filters.badgeCode) params.set("badge_code", state.filters.badgeCode);
    const suffix = params.toString();
    router.push(suffix ? `/orders?${suffix}` : "/orders");
  };

  const focusInput = (event: FocusEvent<HTMLInputElement>) => {
    if (state.filterLabel || state.query.trim()) {
      dispatch({ type: "suggestionsOpened" });
      return;
    }

    dispatch({ type: "filtersOpened" });
    if (window.matchMedia("(max-width: 767px)").matches) {
      const input = event.currentTarget;
      window.requestAnimationFrame(() => input.blur());
    }
  };

  const keyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      dispatch({
        type: "suggestionHighlighted",
        index: Math.min(state.activeSuggestion + 1, suggestionsState.items.length - 1),
      });
      dispatch({ type: "suggestionsOpened" });
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      dispatch({ type: "suggestionHighlighted", index: Math.max(state.activeSuggestion - 1, -1) });
    } else if (event.key === "Escape") {
      dispatch({ type: "closed" });
    }
  };

  const selectFilter = (filters: PublicOrderSearchFilters, label: string) =>
    dispatch({ type: "filterSelected", filters, label });

  return {
    state,
    suggestionsState,
    dispatch,
    submit,
    focusInput,
    keyDown,
    selectFilter,
  };
}
