"use client";

import { useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { SearchBar, type SearchBarSuggestion } from "@/source/shared/ui/SearchBar";
import { useOrderSearchSuggestions, type OrderSuggestion } from "../model/useOrderSearchSuggestions";

export function OrderSearchBar() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const suggestions = useOrderSearchSuggestions({ query: value });

  const items: SearchBarSuggestion[] = suggestions.map((s) => ({
    id: s.id,
    title: s.title,
    subtitle: s.company || undefined,
  }));

  const go = (s: OrderSuggestion) => {
    setOpen(false);
    router.push(`/order/${s.publicId}`);
  };

  const submit = () => {
    const target = activeIndex >= 0 ? suggestions[activeIndex] : suggestions[0];
    if (target) go(target);
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
      onSubmit={submit}
      placeholder="Поиск по заказам платформы"
      suggestions={items}
      activeSuggestionIndex={activeIndex}
      onSuggestionHover={setActiveIndex}
      onSuggestionPick={(picked) => {
        const s = suggestions.find((x) => x.id === picked.id);
        if (s) go(s);
      }}
      onKeyDown={onKeyDown}
      onFocus={() => setOpen(true)}
      onBlur={() => window.setTimeout(() => setOpen(false), 120)}
      showDropdown={open && items.length > 0}
    />
  );
}
