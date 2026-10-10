import { adminFetch } from "@/shared/api";
import type { ChangeReport, ChangeReportList, ChangeReportStatus } from "../model/types";

/** Сообщения «об изменении», при необходимости — только одного статуса. */
export const fetchChangeReports = async (status: string): Promise<ChangeReportList> => {
  const params = new URLSearchParams();

  if (status) params.set("status", status);

  const response = await adminFetch(`/rtn/change-reports?${params}`);

  return response.json();
};

/** Сменить статус сообщения. Бэкенд принимает статус в query-строке. */
export const setChangeReportStatus = async (id: number, status: ChangeReportStatus): Promise<ChangeReport> => {
  const response = await adminFetch(`/rtn/change-reports/${id}?status=${status}`, { method: "PATCH" });

  return response.json();
};
