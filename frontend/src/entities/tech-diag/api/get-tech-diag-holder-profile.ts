import { request } from "@/shared/api/request";
import type { TechDiagHolderProfile } from "../model/types";

/** Загружает анкету лаборатории неразрушающего контроля. */
export async function getTechDiagHolderProfile(): Promise<TechDiagHolderProfile> {
  const response = await request("/directions/tech-diag/license-holder-profile", {
    errorMessage: "Не удалось загрузить анкету лаборатории",
  });

  return response.json();
}
