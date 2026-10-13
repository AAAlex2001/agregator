export type RawSearchParams = Record<string, string | string[] | undefined>;

/** Фильтры каталога из адреса страницы — строкой запроса к API. Номер страницы к фильтрам не относится. */
export function toCatalogQuery(params: RawSearchParams): string {
  const query = new URLSearchParams();
  Object.entries(params)
    .filter(([key]) => key !== "page")
    .forEach(([key, value]) => [value ?? []].flat().forEach((item) => query.append(key, item)));
  return query.toString();
}
