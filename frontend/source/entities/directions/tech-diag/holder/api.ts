import { json, send } from "@/source/shared/api/request";
import type { TechDiagHolderProfile } from "./types";

/** Анкета лаборатории НК. */
export async function fetchTechDiagHolderProfile(): Promise<TechDiagHolderProfile> {
  const response = await send("/directions/tech-diag/license-holder-profile", {}, "Не удалось загрузить анкету лаборатории");
  return response.json();
}

/** Сохранить анкету лаборатории НК. */
export async function saveTechDiagHolderProfile(profile: TechDiagHolderProfile): Promise<TechDiagHolderProfile> {
  const response = await send(
    "/directions/tech-diag/license-holder-profile",
    json("PUT", profile),
    "Не удалось сохранить анкету лаборатории",
  );
  return response.json();
}
