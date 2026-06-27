import { API_URL } from "@/source/shared/api/config";
import { fetchWithSession } from "@/source/shared/api/session";
import type { HazardCatalog, HazardReportItem, HazardResult, HazardSelections } from "../model/types";

async function detail(res: Response, fallback: string): Promise<string> {
  return (await res.json().catch(() => ({})))?.detail || fallback;
}

export async function fetchHazardCatalog(profile: string): Promise<HazardCatalog> {
  const res = await fetchWithSession(`${API_URL}/hazard/catalog?profile=${profile}`);
  if (!res.ok) throw new Error(await detail(res, "Не удалось загрузить факторы"));
  return res.json();
}

export async function calculateHazard(profile: string, selections: HazardSelections): Promise<HazardResult> {
  const res = await fetchWithSession(`${API_URL}/hazard/calculate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profile, selections }),
  });
  if (!res.ok) throw new Error(await detail(res, "Не удалось выполнить расчёт"));
  return res.json();
}

export async function createHazardReport(
  profile: string,
  selections: HazardSelections,
  reportName: string,
): Promise<Blob> {
  const res = await fetchWithSession(`${API_URL}/hazard/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profile, selections, report_name: reportName }),
  });
  if (!res.ok) throw new Error(await detail(res, "Не удалось сформировать отчёт"));
  return res.blob();
}

export async function fetchHazardReports(): Promise<HazardReportItem[]> {
  const res = await fetchWithSession(`${API_URL}/hazard/reports`);
  if (!res.ok) throw new Error(await detail(res, "Не удалось загрузить историю"));
  return (await res.json()).items;
}

export function getHazardReportPdfUrl(id: number): string {
  return `${API_URL}/hazard/reports/${id}/pdf`;
}
