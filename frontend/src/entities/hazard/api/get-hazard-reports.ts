import { request } from "@/shared/api/request";
import type { HazardReport } from "../model/types";

/** Ответ истории отчётов эксперта. */
interface HazardReportsResponse {
  items: HazardReport[];
}

/** Загружает историю отчётов эксперта, новые сверху. */
export async function getHazardReports(): Promise<HazardReport[]> {
  const response = await request("/hazard/reports", {
    errorMessage: "Не удалось загрузить историю",
  });
  const data: HazardReportsResponse = await response.json();

  return data.items;
}
