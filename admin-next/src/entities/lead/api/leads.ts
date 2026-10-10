import { adminFetch, jsonBody } from "@/shared/api";
import type { Lead, LeadChanges, LeadList } from "../model/types";

/** Страница заявок с сайта, новые сверху, при необходимости — только одного статуса. */
export const fetchLeads = async (status: string, limit: number, offset: number): Promise<LeadList> => {
  const params = new URLSearchParams({ limit: String(limit), skip: String(offset) });

  if (status) params.set("status", status);

  const response = await adminFetch(`/leads?${params}`);

  return response.json();
};

/** Сменить статус заявки или заметку менеджера. */
export const updateLead = async (id: number, changes: LeadChanges): Promise<Lead> => {
  const response = await adminFetch(`/leads/${id}`, jsonBody("PATCH", changes));

  return response.json();
};
