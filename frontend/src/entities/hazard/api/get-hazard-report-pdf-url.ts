import { API_URL } from "@/shared/config/api";

/** Возвращает адрес PDF сохранённого отчёта с авторизацией через cookie. */
export function getHazardReportPdfUrl(reportId: number): string {
  return `${API_URL}/hazard/reports/${reportId}/pdf`;
}
