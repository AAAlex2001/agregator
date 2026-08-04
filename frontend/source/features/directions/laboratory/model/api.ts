import { getJson, putJson } from "../../shared/model/http";
import type { LaboratoryProfile } from "./types";

export function fetchLaboratoryProfile(): Promise<LaboratoryProfile> {
  return getJson("/directions/laboratory/profile", "Не удалось загрузить анкету лаборатории");
}

export function saveLaboratoryProfile(profile: LaboratoryProfile): Promise<LaboratoryProfile> {
  return putJson("/directions/laboratory/profile", profile, "Не удалось сохранить анкету лаборатории");
}
