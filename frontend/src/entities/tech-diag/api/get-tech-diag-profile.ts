import { request } from "@/shared/api/request";
import type { TechDiagProfile } from "../model/types";

/** Загружает анкету специалиста неразрушающего контроля. */
export async function getTechDiagProfile(): Promise<TechDiagProfile> {
  const response = await request("/directions/tech-diag/expert-profile", {
    errorMessage: "Не удалось загрузить анкету специалиста НК",
  });

  return response.json();
}
