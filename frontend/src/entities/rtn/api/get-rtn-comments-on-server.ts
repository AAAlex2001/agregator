import "server-only";

import { SERVER_API_URL } from "@/shared/config/server-api";
import type { RtnComment, RtnCommentsResponse } from "../model/types";

/** Загружает публичное обсуждение для серверного HTML без пользовательской сессии. */
export async function getRtnCommentsOnServer(
  clarificationId: number,
): Promise<RtnComment[]> {
  const response = await fetch(
    `${SERVER_API_URL}/public/rtn/clarifications/${clarificationId}/comments`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Не удалось загрузить обсуждение: ${response.status}`);
  }

  const result: RtnCommentsResponse = await response.json();

  return result.items;
}
