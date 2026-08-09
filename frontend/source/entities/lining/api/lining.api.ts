import { API_URL } from "@/source/shared/api/config";
import { fetchWithSession } from "@/source/shared/api/session";
import { readErrorMessage } from "@/source/shared/api/errorMessage";
import type { LiningCatalog, LiningInput, LiningReportItem } from "../model/types";

export async function fetchLiningCatalog(profile: string): Promise<LiningCatalog> {
  const res = await fetchWithSession(`${API_URL}/lining/catalog?profile=${profile}`);
  if (!res.ok) throw new Error(await readErrorMessage(res, "Не удалось загрузить справочник"));
  return res.json();
}

export async function createLiningReport(
  input: LiningInput,
  reportName: string,
  header: Record<string, string>,
): Promise<LiningReportItem> {
  const res = await fetchWithSession(`${API_URL}/lining/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...input, report_name: reportName, ...header }),
  });
  if (!res.ok) throw new Error(await readErrorMessage(res, "Не удалось сформировать отчёт"));
  return res.json();
}

export async function fetchLiningReports(): Promise<LiningReportItem[]> {
  const res = await fetchWithSession(`${API_URL}/lining/reports`);
  if (!res.ok) throw new Error(await readErrorMessage(res, "Не удалось загрузить историю"));
  return (await res.json()).items;
}

export function getLiningReportPdfUrl(id: number): string {
  return `${API_URL}/lining/reports/${id}/pdf`;
}
