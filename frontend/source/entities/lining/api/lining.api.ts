import { API_URL } from "@/source/shared/api/config";
import { fetchWithSession } from "@/source/shared/api/session";
import type { LiningCatalog, LiningInput, LiningReportItem, LiningResult } from "../model/types";

async function detail(res: Response, fallback: string): Promise<string> {
  return (await res.json().catch(() => ({})))?.detail || fallback;
}

export async function fetchLiningCatalog(profile: string): Promise<LiningCatalog> {
  const res = await fetchWithSession(`${API_URL}/lining/catalog?profile=${profile}`);
  if (!res.ok) throw new Error(await detail(res, "Не удалось загрузить справочник"));
  return res.json();
}

export async function calculateLining(input: LiningInput): Promise<LiningResult> {
  const res = await fetchWithSession(`${API_URL}/lining/calculate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await detail(res, "Не удалось выполнить расчёт"));
  return res.json();
}

export async function createLiningReport(
  input: LiningInput,
  reportName: string,
  header: Record<string, string>,
): Promise<Blob> {
  const res = await fetchWithSession(`${API_URL}/lining/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...input, report_name: reportName, ...header }),
  });
  if (!res.ok) throw new Error(await detail(res, "Не удалось сформировать отчёт"));
  return res.blob();
}

export async function fetchLiningReports(): Promise<LiningReportItem[]> {
  const res = await fetchWithSession(`${API_URL}/lining/reports`);
  if (!res.ok) throw new Error(await detail(res, "Не удалось загрузить историю"));
  return (await res.json()).items;
}

export function getLiningReportPdfUrl(id: number): string {
  return `${API_URL}/lining/reports/${id}/pdf`;
}
