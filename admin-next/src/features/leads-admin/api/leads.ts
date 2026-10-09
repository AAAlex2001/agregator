import type { Lead, LeadStatus } from "@/entities/lead";
import { adminRequest, jsonBody } from "@/shared/api";

export type LeadList = {
  items: Lead[];
  total: number;
};

/** Страница заявок с сайта, новые сверху, при необходимости — только одного статуса. */
export const fetchLeads = (status: string, limit: number, offset: number) => {
  const params = new URLSearchParams({ limit: String(limit), skip: String(offset) });

  if (status) params.set("status", status);

  return adminRequest<LeadList>(`/leads?${params}`);
};

/** Сменить статус заявки или заметку менеджера. */
export const updateLead = (id: number, changes: { status?: LeadStatus; comment?: string }) =>
  adminRequest<Lead>(`/leads/${id}`, jsonBody("PATCH", changes));
