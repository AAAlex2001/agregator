import { request } from "@/shared/api/request";
import type { ExpertiseProfileValues } from "../model/types";

/** Загружает удостоверения текущего эксперта промышленной безопасности. */
export async function getExpertiseProfile(): Promise<ExpertiseProfileValues> {
  const response = await request("/directions/expertise/profile", {
    errorMessage: "Не удалось загрузить анкету ЭПБ",
  });

  return response.json();
}
