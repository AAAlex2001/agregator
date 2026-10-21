import { adminFetch, jsonBody } from "@/shared/api";
import type { ApplicationList, ApplicationStatus, CommissionApplication } from "../model/types";

/** Заявки кандидатов, новые первыми. Пустой статус — все. */
export const fetchApplications = async (
  status: ApplicationStatus | "",
  limit: number,
  offset: number,
  signal: AbortSignal,
): Promise<ApplicationList> => {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });

  if (status) params.set("status", status);

  const response = await adminFetch(`/commission/applications?${params}`, { signal });

  return response.json();
};

/** Поменять статус и комментарий. Кандидат получит письмо, если статус изменился. */
export const reviewApplication = async (
  id: number,
  status: ApplicationStatus,
  decision: string,
): Promise<CommissionApplication> => {
  const body = { status, decision: decision || null };
  const response = await adminFetch(`/commission/applications/${id}`, jsonBody("PATCH", body));

  return response.json();
};

/** Удалить заявку. */
export const deleteApplication = async (id: number): Promise<void> => {
  await adminFetch(`/commission/applications/${id}`, { method: "DELETE" });
};
