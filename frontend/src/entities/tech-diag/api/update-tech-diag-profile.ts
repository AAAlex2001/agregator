import { request } from "@/shared/api/request";
import type { TechDiagProfile, TechDiagProfileValues } from "../model/types";

/** Сохраняет поля анкеты специалиста; документы передаются отдельными запросами. */
export async function updateTechDiagProfile(
  values: TechDiagProfileValues,
): Promise<TechDiagProfile> {
  const response = await request("/directions/tech-diag/expert-profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
    errorMessage: "Не удалось сохранить анкету специалиста НК",
  });

  return response.json();
}
