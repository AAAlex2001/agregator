"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/** Пауза после ввода перед загрузкой результатов поиска. */
const SEARCH_DELAY_MS = 300;

/** Ищет разъяснения по тексту, сохраняя остальные фильтры в адресе каталога. */
export function useRtnSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("search") ?? "");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const search = value.trim();

      if ((params.get("search") ?? "") === search) {
        return;
      }

      if (search) {
        params.set("search", search);
      } else {
        params.delete("search");
      }

      params.delete("page");
      router.replace(`${pathname}?${params}`, { scroll: false });
    }, SEARCH_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [value, pathname, router]);

  /** Сохраняет ввод до следующего обновления поискового запроса. */
  function change(value: string) {
    setValue(value);
  }

  /** Очищает строку поиска, сохраняя выбранные фильтры. */
  function clear() {
    setValue("");
  }

  return {
    value,
    change,
    clear,
  };
}
