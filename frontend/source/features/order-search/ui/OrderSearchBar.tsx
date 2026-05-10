"use client";

import { useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { SearchBar, type SearchBarSuggestion } from "@/source/shared/ui/SearchBar";
import { useOrderSearchSuggestions } from "../model/useOrderSearchSuggestions";

export function OrderSearchBar() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const { items: suggestions, isLoading, hasQuery } = useOrderSearchSuggestions({ query: value });

  const items: SearchBarSuggestion[] = suggestions.map((s) => ({
    id: s.id,
    title: s.title,
    subtitle: s.company || undefined,
  }));

  const goToOrders = () => {
    setOpen(false);
    router.push("/orders");
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
      setOpen(true);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <SearchBar
      value={value}
      onChange={(v) => {
        setValue(v);
        setActiveIndex(-1);
        setOpen(true);
      }}
      onSubmit={goToOrders}
      placeholder="Поиск по заказам"
      suggestions={items}
      activeSuggestionIndex={activeIndex}
      onSuggestionHover={setActiveIndex}
      onSuggestionPick={goToOrders}
      onKeyDown={onKeyDown}
      onFocus={() => setOpen(true)}
      onBlur={() => window.setTimeout(() => setOpen(false), 120)}
      showDropdown={open && hasQuery}
      isLoading={isLoading}
      emptyLabel="По вашему запросу ничего не найдено"
      loadingLabel="Ищем заказы…"
    />
  );
}
