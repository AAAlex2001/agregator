import "server-only";

import { SERVER_API_URL } from "@/shared/config/server-api";
import type { RtnList, RtnListQuery } from "../model/types";
import { createRtnListQuery } from "./list-query";

/** Загружает каталог для серверной страницы и карты сайта. */
export async function getRtnListOnServer(query: RtnListQuery): Promise<RtnList> {
  const params = createRtnListQuery(query);
  const path = `/public/rtn/clarifications?${params}`;
  const response = await fetch(`${SERVER_API_URL}${path}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Не удалось загрузить разъяснения: ${response.status}`);
  }

  return response.json();
}
