import { RTN_MAX_PAGE } from "@/entities/rtn";

/** Параметры адреса каталога, включая повторяющиеся значения фильтров. */
export interface RtnSearchParams {
  [name: string]: string | string[] | undefined;
}

/** Параметры, которые Next.js передаёт серверной странице каталога. */
export interface RtnCatalogPageProps {
  searchParams: Promise<RtnSearchParams>;
}

/** Ограничивает номер индексируемой страницы прежним диапазоном каталога. */
export function readRtnPage(params: RtnSearchParams): number {
  return Math.min(RTN_MAX_PAGE, Math.max(1, Number(params.page) || 1));
}

/** Передаёт фильтры в API, исключая только номер страницы. */
export function readRtnFilters(params: RtnSearchParams): string {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([name, value]) => {
    if (name === "page" || value === undefined) {
      return;
    }

    const values = Array.isArray(value) ? value : [value];

    values.forEach((item) => query.append(name, item));
  });

  return query.toString();
}
