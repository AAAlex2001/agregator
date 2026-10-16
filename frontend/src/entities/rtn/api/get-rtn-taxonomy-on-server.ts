import "server-only";

import { SERVER_API_URL } from "@/shared/config/server-api";
import type { RtnTaxonomy } from "../model/types";

/** Загружает доступные фильтры вместе с первой страницей каталога. */
export async function getRtnTaxonomyOnServer(): Promise<RtnTaxonomy> {
  const response = await fetch(`${SERVER_API_URL}/public/rtn/taxonomy`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Не удалось загрузить справочник фильтров: ${response.status}`);
  }

  return response.json();
}
