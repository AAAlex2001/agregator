import { request } from "@/shared/api/request";
import type { ResearchProfile } from "../model/types";

/** Загружает анкету исполнителя научно-исследовательских работ. */
export async function getResearchProfile(): Promise<ResearchProfile> {
  const response = await request("/directions/research/profile", {
    errorMessage: "Не удалось загрузить анкету НИР",
  });

  return response.json();
}
