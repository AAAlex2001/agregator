import { RtnChangeReport, RtnChangeReportStatus } from "./model";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const toReport = (raw: any): RtnChangeReport => ({
  id: raw.id,
  clarificationId: raw.clarification_id,
  description: raw.description,
  status: raw.status,
  createdAt: raw.created_at,
});

export const listChangeReports = async (status?: RtnChangeReportStatus): Promise<RtnChangeReport[]> => {
  const qs = status ? `?status=${status}` : "";
  const response = await fetch(`${base}/api/rtn/change-reports${qs}`);
  if (response.status === 401) throw new Error("UNAUTHORIZED");
  if (!response.ok) throw new Error("Не удалось загрузить сообщения");
  const data = await response.json();
  return data.items.map(toReport);
};

export const setChangeReportStatus = async (id: number, status: RtnChangeReportStatus): Promise<RtnChangeReport> => {
  const response = await fetch(`${base}/api/rtn/change-reports/${id}?status=${status}`, { method: "PATCH" });
  if (response.status === 401) throw new Error("UNAUTHORIZED");
  if (!response.ok) throw new Error("Не удалось обновить статус сообщения");
  return toReport(await response.json());
};
