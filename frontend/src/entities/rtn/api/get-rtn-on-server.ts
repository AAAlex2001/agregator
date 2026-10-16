import "server-only";

import { SERVER_API_URL } from "@/shared/config/server-api";
import type { RtnDetail } from "../model/types";

/** Загружает разъяснение для страницы и SEO; отсутствие возвращает как null. */
export async function getRtnOnServer(slug: string): Promise<RtnDetail | null> {
  const path = `/public/rtn/clarifications/${encodeURIComponent(slug)}`;
  const response = await fetch(`${SERVER_API_URL}${path}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Не удалось загрузить разъяснение: ${response.status}`);
  }

  return response.json();
}
