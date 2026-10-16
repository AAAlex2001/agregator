import { API_URL } from "@/shared/config/api";

/** Возвращает адрес PDF-отчёта по завершённому тендеру с авторизацией через cookie. */
export function getReportPdfUrl(orderId: number): string {
  return `${API_URL}/reports/${orderId}/pdf`;
}
