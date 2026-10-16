import type { RtnListQuery } from "../model/types";

/** Сохраняет повторяющиеся фильтры и задаёт размер и смещение списка. */
export function createRtnListQuery(query: RtnListQuery): string {
  const params = new URLSearchParams(query.filters);

  params.set("limit", String(query.limit));
  params.set("offset", String(query.offset));

  return params.toString();
}
