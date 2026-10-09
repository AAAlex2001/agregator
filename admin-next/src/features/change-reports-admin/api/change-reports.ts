import type { ChangeReport, ChangeReportStatus } from "@/entities/change-report";
import { adminRequest } from "@/shared/api";

type ChangeReportList = {
  items: ChangeReport[];
};

/** Сообщения «об изменении», при необходимости — только одного статуса. */
export const fetchChangeReports = (status: string) => {
  const params = new URLSearchParams();

  if (status) params.set("status", status);

  return adminRequest<ChangeReportList>(`/rtn/change-reports?${params}`);
};

/** Сменить статус сообщения. Бэкенд принимает статус в query-строке. */
export const setChangeReportStatus = (id: number, status: ChangeReportStatus) =>
  adminRequest<ChangeReport>(`/rtn/change-reports/${id}?status=${status}`, { method: "PATCH" });
