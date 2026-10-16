import { request } from "@/shared/api/request";
import type { ResearchOptions } from "../model/types";

/** Загружает учёные степени, звания и отрасли науки. */
export async function getResearchOptions(): Promise<ResearchOptions> {
  const response = await request("/directions/research/catalogs", {
    errorMessage: "Не удалось загрузить справочники направления",
  });

  return response.json();
}
