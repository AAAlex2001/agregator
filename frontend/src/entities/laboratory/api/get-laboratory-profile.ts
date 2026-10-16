import { request } from "@/shared/api/request";
import type { LaboratoryProfile } from "../model/types";

/** Загружает область аккредитации и сведения о лаборатории. */
export async function getLaboratoryProfile(): Promise<LaboratoryProfile> {
  const response = await request("/directions/laboratory/profile", {
    errorMessage: "Не удалось загрузить анкету лаборатории",
  });

  return response.json();
}
