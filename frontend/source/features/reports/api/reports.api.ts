import { API_URL } from "@/source/shared/api/config";
import { fetchWithSession } from "@/source/shared/api/session";
import type { OrdersApiList } from "@/source/entities/order";

export async function fetchReports(skip = 0, limit = 50): Promise<OrdersApiList> {
  const res = await fetchWithSession(`${API_URL}/reports/?skip=${skip}&limit=${limit}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.detail || "Не удалось загрузить отчёты");
  }
  return res.json();
}

export function getReportPdfUrl(orderId: number): string {
  return `${API_URL}/reports/${orderId}/pdf`;
}
