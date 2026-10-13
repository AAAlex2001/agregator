import { json, send } from "@/source/shared/api/request";
import type { ExpertiseProfile } from "./types";

/** Анкета эксперта ЭПБ. */
export async function fetchExpertiseProfile(): Promise<ExpertiseProfile> {
  const response = await send("/directions/expertise/profile", {}, "Не удалось загрузить анкету ЭПБ");
  return response.json();
}

/** Сохранить анкету эксперта ЭПБ. */
export async function saveExpertiseProfile(profile: ExpertiseProfile): Promise<ExpertiseProfile> {
  const response = await send("/directions/expertise/profile", json("PUT", profile), "Не удалось сохранить анкету ЭПБ");
  return response.json();
}
