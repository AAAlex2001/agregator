import "server-only";

import { SERVER_API_URL } from "@/shared/config/server-api";
import type { ExpertContact } from "../model/types";

/** Загружает каталог исполнителей для серверного HTML публичной страницы. */
export async function getExpertContactsOnServer(): Promise<ExpertContact[]> {
  const response = await fetch(`${SERVER_API_URL}/expert-contacts?limit=500`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Не удалось загрузить контакты исполнителей");
  }

  const data: { items: ExpertContact[] } = await response.json();

  return data.items;
}
