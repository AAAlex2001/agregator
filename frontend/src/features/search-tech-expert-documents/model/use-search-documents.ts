"use client";

import { useState } from "react";
import { useTechExpertTips } from "@/entities/tech-expert";
import type { TechExpertTip } from "@/entities/tech-expert";

/** Хранит строку поиска и открытость подсказок; поиск запускает переданное действие. */
export function useSearchDocuments(onSearch: (query: string) => void, onClear: () => void) {
  const [query, setQuery] = useState("");
  const [isTipsOpen, setTipsOpen] = useState(false);
  const tips = useTechExpertTips(query);

  /** Меняет строку и показывает подсказки к новому вводу. */
  function changeQuery(value: string) {
    setQuery(value);
    setTipsOpen(true);
  }

  /** Возвращает подсказки при возврате в поле поиска. */
  function openTips() {
    setTipsOpen(true);
  }

  /** Ищет по введённой строке, если она не пустая. */
  function search() {
    const trimmedQuery = query.trim();

    if (trimmedQuery) {
      setTipsOpen(false);
      onSearch(trimmedQuery);
    }
  }

  /** Подставляет подсказку в строку и сразу ищет по ней. */
  function pickTip(tip: TechExpertTip) {
    setQuery(tip.value);
    setTipsOpen(false);
    onSearch(tip.value.trim());
  }

  /** Очищает строку поиска вместе с найденными документами. */
  function clear() {
    setQuery("");
    setTipsOpen(false);
    onClear();
  }

  return {
    query,
    tips: isTipsOpen ? tips : [],
    changeQuery,
    openTips,
    search,
    pickTip,
    clear,
  };
}
