import { request } from "@/shared/api/request";
import type { HazardCatalog, HazardProfile } from "../model/types";

/** Загружает факторы выбранного профиля, сгруппированные по видам аварий. */
export async function getHazardCatalog(profile: HazardProfile): Promise<HazardCatalog> {
  const response = await request(`/hazard/catalog?profile=${profile}`, {
    errorMessage: "Не удалось загрузить факторы",
  });

  return response.json();
}
