import { request } from "@/shared/api/request";
import type { LiningReport } from "../model/types";

/** Ответ истории отчётов эксперта. */
interface LiningReportsResponse {
  items: LiningReport[];
}

/** Загружает историю отчётов эксперта, новые сверху. */
export async function getLiningReports(): Promise<LiningReport[]> {
  const response = await request("/lining/reports", {
    errorMessage: "Не удалось загрузить историю",
  });
  const data: LiningReportsResponse = await response.json();

  return data.items;
}
