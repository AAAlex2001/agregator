import { API_URL } from "@/shared/config/api";

/** Возвращает адрес PDF сохранённого отчёта с авторизацией через cookie. */
export function getLiningReportPdfUrl(reportId: number): string {
  return `${API_URL}/lining/reports/${reportId}/pdf`;
}
