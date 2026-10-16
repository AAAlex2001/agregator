import { request } from "@/shared/api/request";
import type { TechDiagOptions } from "../model/types";

/** Загружает виды неразрушающего контроля и объекты контроля. */
export async function getTechDiagOptions(): Promise<TechDiagOptions> {
  const response = await request("/directions/tech-diag/catalogs", {
    errorMessage: "Не удалось загрузить виды и объекты контроля",
  });

  return response.json();
}
