import { send } from "@/source/shared/api/request";
import type { TechDiagCatalogs } from "./types";

/** Справочники НК: виды контроля и объекты. */
export async function fetchTechDiagCatalogs(): Promise<TechDiagCatalogs> {
  const response = await send("/directions/tech-diag/catalogs", {}, "Не удалось загрузить справочники направления");
  return response.json();
}
