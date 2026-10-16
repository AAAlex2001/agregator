import { API_URL } from "@/shared/config/api";
import type { RtnList, RtnListQuery } from "../model/types";
import { createRtnListQuery } from "./list-query";

/** Загружает следующую часть публичного каталога в браузере. */
export async function getRtnList(query: RtnListQuery): Promise<RtnList> {
  const params = createRtnListQuery(query);
  const response = await fetch(`${API_URL}/public/rtn/clarifications?${params}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Не удалось загрузить разъяснения: ${response.status}`);
  }

  return response.json();
}
