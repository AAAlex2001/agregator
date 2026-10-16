import { request } from "@/shared/api/request";
import type { TechDiagHolderProfile } from "../model/types";

/** Сохраняет виды контроля и местоположение лаборатории. */
export async function updateTechDiagHolderProfile(
  values: TechDiagHolderProfile,
): Promise<TechDiagHolderProfile> {
  const response = await request("/directions/tech-diag/license-holder-profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
    errorMessage: "Не удалось сохранить анкету лаборатории",
  });

  return response.json();
}
