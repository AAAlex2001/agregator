"use client";

import { useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import type { PublicOrderSearchFilters } from "@/source/entities/order";
import { SearchBar, type SearchBarSuggestion } from "@/source/shared/ui/SearchBar";
import { useOrderSearchSuggestions } from "../model/useOrderSearchSuggestions";
import { OrderSearchFilters } from "./OrderSearchFilters";
import s from "./OrderSearchBar.module.scss";

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

  const goToOrders = (filters: PublicOrderSearchFilters = {}) => {
    setOpen(false);
    const params = new URLSearchParams();
    const query = value.trim();
    if (query) params.set("q", query);
    if (filters.workType) params.set("work_type", filters.workType);
    if (filters.badgeCode) params.set("badge_code", filters.badgeCode);
    const suffix = params.toString();
    router.push(suffix ? `/orders?${suffix}` : "/orders");
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
    <div className={s.wrap}>
      <SearchBar
        value={value}
        onChange={(v) => {
          setValue(v);
          setActiveIndex(-1);
          setOpen(true);
        }}
        onSubmit={() => goToOrders()}
        placeholder="Найдите заказ или выберите направление"
        suggestions={items}
        activeSuggestionIndex={activeIndex}
        onSuggestionHover={setActiveIndex}
        onSuggestionPick={() => goToOrders()}
        onKeyDown={onKeyDown}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
        showDropdown={open && hasQuery}
        isLoading={isLoading}
        emptyLabel="По вашему запросу ничего не найдено"
        loadingLabel="Ищем заказы…"
      />
      {open && value.trim() === "" && (
        <OrderSearchFilters
          onClose={() => setOpen(false)}
          onSelect={(filters) => goToOrders(filters)}
        />
      )}
    </div>
  );
}
