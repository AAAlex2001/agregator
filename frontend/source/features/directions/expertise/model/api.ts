import { getJson, putJson } from "../../shared/model/http";
import type { ExpertiseProfile } from "./types";

export function fetchExpertiseProfile(): Promise<ExpertiseProfile> {
  return getJson("/directions/expertise/profile", "Не удалось загрузить анкету ЭПБ");
}

export function saveExpertiseProfile(profile: ExpertiseProfile): Promise<ExpertiseProfile> {
  return putJson("/directions/expertise/profile", profile, "Не удалось сохранить анкету ЭПБ");
}
