"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { RtnDateFilter, RtnOptionFilter } from "./types";

/** Меняет фильтры в адресе каталога, чтобы сервер загрузил выбранные разъяснения. */
export function useRtnFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasFilters = [...searchParams.keys()].some(
    (key) => key !== "search" && key !== "page",
  );

  /** Открывает первую страницу выбранных фильтров без прокрутки к началу. */
  function applyFilters(params: URLSearchParams) {
    params.delete("page");
    router.push(`${pathname}?${params}`, { scroll: false });
  }

  /** Возвращает выбранные пункты одного справочника. */
  function selectedValues(param: RtnOptionFilter): string[] {
    return searchParams.getAll(param);
  }

  /** Возвращает одну границу периода публикации. */
  function dateValue(param: RtnDateFilter): string {
    return searchParams.get(param) ?? "";
  }

  /** Добавляет или снимает один пункт, сохраняя остальные параметры поиска. */
  function toggleOption(param: RtnOptionFilter, value: string) {
    const params = new URLSearchParams(searchParams);
    const selected = params.getAll(param);
    const nextValues = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];

    params.delete(param);

    for (const nextValue of nextValues) {
      params.append(param, nextValue);
    }

    applyFilters(params);
  }

  /** Устанавливает или очищает одну границу периода. */
  function changeDate(param: RtnDateFilter, value: string) {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(param, value);
    } else {
      params.delete(param);
    }

    applyFilters(params);
  }

  /** Снимает фильтры, сохраняя введённый поисковый запрос. */
  function resetFilters() {
    const params = new URLSearchParams();
    const search = searchParams.get("search");

    if (search) {
      params.set("search", search);
    }

    applyFilters(params);
  }

  return {
    hasFilters,
    selectedValues,
    dateValue,
    toggleOption,
    changeDate,
    resetFilters,
  };
}
