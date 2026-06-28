import { API_URL } from "@/source/shared/api/config";
import { fetchWithSession } from "@/source/shared/api/session";
import type {
  HazardCatalog,
  HazardFactor,
  HazardReportItem,
  HazardSelections,
} from "../model/types";

async function detail(res: Response, fallback: string): Promise<string> {
  return (await res.json().catch(() => ({})))?.detail || fallback;
}

export async function fetchHazardCatalog(profile: string): Promise<HazardCatalog> {
  const res = await fetchWithSession(`${API_URL}/hazard/catalog?profile=${profile}`);
  if (!res.ok) throw new Error(await detail(res, "Не удалось загрузить факторы"));
  return res.json();
}

export async function saveHazardCatalog(profile: string, factors: HazardFactor[]): Promise<HazardCatalog> {
  const res = await fetchWithSession(`${API_URL}/hazard/catalog`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profile, factors }),
  });
  if (!res.ok) throw new Error(await detail(res, "Не удалось сохранить факторы"));
  return res.json();
}

export async function resetHazardCatalog(profile: string): Promise<HazardCatalog> {
  const res = await fetchWithSession(`${API_URL}/hazard/catalog?profile=${profile}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await detail(res, "Не удалось сбросить факторы"));
  return res.json();
}

export async function createHazardReport(
  profile: string,
  selections: HazardSelections,
  reportName: string,
  header: Record<string, string>,
  excludedGroups: string[],
): Promise<HazardReportItem> {
  const res = await fetchWithSession(`${API_URL}/hazard/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profile, selections, report_name: reportName, excluded_groups: excludedGroups, ...header }),
  });
  if (!res.ok) throw new Error(await detail(res, "Не удалось сформировать отчёт"));
  return res.json();
}

export async function fetchHazardReports(): Promise<HazardReportItem[]> {
  const res = await fetchWithSession(`${API_URL}/hazard/reports`);
  if (!res.ok) throw new Error(await detail(res, "Не удалось загрузить историю"));
  return (await res.json()).items;
}

export function getHazardReportPdfUrl(id: number): string {
  return `${API_URL}/hazard/reports/${id}/pdf`;
}
