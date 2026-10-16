import "server-only";

import { SERVER_API_URL } from "@/shared/config/server-api";
import type { RtnListItem } from "../model/types";

/** Загружает похожие разъяснения; отказ API оставляет список пустым. */
export async function getRelatedRtnOnServer(
  slug: string,
  limit: number,
): Promise<RtnListItem[]> {
  const path = `/public/rtn/clarifications/${encodeURIComponent(slug)}/related`;
  const response = await fetch(`${SERVER_API_URL}${path}?limit=${limit}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
}
