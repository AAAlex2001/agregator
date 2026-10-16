import { request } from "@/shared/api/request";
import type { TechExpertTip } from "../model/types";

/** Загружает подсказки по началу названия или номера документа. */
export async function getTechExpertTips(query: string): Promise<TechExpertTip[]> {
  const response = await request(`/tech-expert/autocomplete?q=${encodeURIComponent(query)}`, {
    errorMessage: "Не удалось загрузить подсказки",
  });

  return response.json();
}
