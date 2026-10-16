import { request } from "@/shared/api/request";
import type { TechExpertSearchResult } from "../model/types";

/** Ищет документы фонда по названию или номеру. */
export async function searchTechExpertDocuments(query: string): Promise<TechExpertSearchResult> {
  const response = await request(`/tech-expert/documents?q=${encodeURIComponent(query)}`, {
    errorMessage: "Не удалось найти документы",
  });

  return response.json();
}
