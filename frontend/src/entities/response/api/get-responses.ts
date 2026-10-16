import { request } from "@/shared/api/request";
import { RESPONSES_PAGE_SIZE } from "../config/list";
import type { ResponseListPage, ResponseQuery } from "../model/types";

/** Загружает страницу откликов вкладки: свои для исполнителя, на свои заказы для заказчика. */
export async function getResponses(
  query: ResponseQuery,
  skip: number,
): Promise<ResponseListPage> {
  const params = new URLSearchParams({
    tab: query.tab,
    skip: String(skip),
    limit: String(RESPONSES_PAGE_SIZE),
  });

  if (query.sort.field) {
    params.set("sort_by", query.sort.field);
    params.set("sort_dir", query.sort.direction);
  }

  const response = await request(`/responses?${params}`, {
    errorMessage: "Не удалось загрузить отклики",
  });

  return response.json();
}
