import { request } from "@/shared/api/request";
import type { LaboratoryProfile, LaboratoryProfileValues } from "../model/types";

/** Сохраняет область аккредитации и комментарий лаборатории. */
export async function updateLaboratoryProfile(
  fields: LaboratoryProfileValues,
): Promise<LaboratoryProfile> {
  const response = await request("/directions/laboratory/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fields),
    errorMessage: "Не удалось сохранить анкету лаборатории",
  });

  return response.json();
}
