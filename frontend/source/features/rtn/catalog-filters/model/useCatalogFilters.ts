"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

/** Фильтры каталога живут в адресе страницы: с ним сервер собирает выдачу, ссылкой можно поделиться. */
export function useCatalogFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const navigate = (params: URLSearchParams) => {
    params.delete("page");
    router.push(`${pathname}?${params}`, { scroll: false });
  };

  const toggle = (param: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    const values = params.getAll(param);
    params.delete(param);
    const next = values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
    next.forEach((item) => params.append(param, item));
    navigate(params);
  };

  const setValue = (param: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(param, value);
    else params.delete(param);
    navigate(params);
  };

  const reset = () => {
    const params = new URLSearchParams();
    const search = searchParams.get("search");
    if (search) params.set("search", search);
    navigate(params);
  };

  return {
    selected: (param: string) => searchParams.getAll(param),
    value: (param: string) => searchParams.get(param) ?? "",
    hasFilters: [...searchParams.keys()].some((key) => key !== "search" && key !== "page"),
    toggle,
    setValue,
    reset,
  };
}
