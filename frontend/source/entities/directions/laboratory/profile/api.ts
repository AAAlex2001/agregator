import { json, send } from "@/source/shared/api/request";
import type { LaboratoryProfile } from "./types";

/** Анкета лаборатории. */
export async function fetchLaboratoryProfile(): Promise<LaboratoryProfile> {
  const response = await send("/directions/laboratory/profile", {}, "Не удалось загрузить анкету лаборатории");
  return response.json();
}

/** Сохранить анкету лаборатории. */
export async function saveLaboratoryProfile(profile: LaboratoryProfile): Promise<LaboratoryProfile> {
  const response = await send("/directions/laboratory/profile", json("PUT", profile), "Не удалось сохранить анкету лаборатории");
  return response.json();
}
