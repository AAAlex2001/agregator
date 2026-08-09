import { API_URL } from "@/source/shared/api/config";
import { fetchWithSession } from "@/source/shared/api/session";
import { readErrorMessage } from "@/source/shared/api/errorMessage";
import type { HazardCatalog, HazardReportItem, HazardSelections } from "../model/types";

export async function fetchHazardCatalog(profile: string): Promise<HazardCatalog> {
  const res = await fetchWithSession(`${API_URL}/hazard/catalog?profile=${profile}`);
  if (!res.ok) throw new Error(await readErrorMessage(res, "Не удалось загрузить факторы"));
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
  if (!res.ok) throw new Error(await readErrorMessage(res, "Не удалось сформировать отчёт"));
  return res.json();
}

export async function fetchHazardReports(): Promise<HazardReportItem[]> {
  const res = await fetchWithSession(`${API_URL}/hazard/reports`);
  if (!res.ok) throw new Error(await readErrorMessage(res, "Не удалось загрузить историю"));
  return (await res.json()).items;
}

export function getHazardReportPdfUrl(id: number): string {
  return `${API_URL}/hazard/reports/${id}/pdf`;
}
