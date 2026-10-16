import { request } from "@/shared/api/request";
import type { HazardReport, HazardReportRequest } from "../model/types";

/** Считает показатели на сервере и сохраняет отчёт в историю эксперта. */
export async function createHazardReport(report: HazardReportRequest): Promise<HazardReport> {
  const response = await request("/hazard/report", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(report),
    errorMessage: "Не удалось сформировать отчёт",
  });

  return response.json();
}
