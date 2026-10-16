import { request } from "@/shared/api/request";
import type { LiningReport, LiningReportRequest } from "../model/types";

/** Считает риск и срок службы крепи на сервере и сохраняет отчёт в историю. */
export async function createLiningReport(report: LiningReportRequest): Promise<LiningReport> {
  const response = await request("/lining/report", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(report),
    errorMessage: "Не удалось сформировать отчёт",
  });

  return response.json();
}
