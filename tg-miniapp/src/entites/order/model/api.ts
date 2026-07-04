import { apiJson } from "@/shared/services/api";
import type { OrderList } from "./types";

export const listOrders = (limit = 10) =>
  apiJson<OrderList>(`/orders/?skip=0&limit=${limit}`);

export const listArchivedOrders = (limit = 20) =>
  apiJson<OrderList>(`/orders/archive?skip=0&limit=${limit}`);

export interface CreateOrderPayload {
  title: string;
  company: string;
  comment: string;
  sumRubles: string;
  startDate: string;
  deadline: string;
  responsesDeadline: string;
  requiresExpert: boolean;
  requiresLicense: boolean;
  badgeCodes: string[];
}

export interface CreateOrderFiles {
  technical: File | null;
  contract: File | null;
  company: File | null;
  other: File[];
}

export function createOrder(payload: CreateOrderPayload, files: CreateOrderFiles): Promise<{ id: number }> {
  const form = new FormData();
  form.append("title", payload.title.trim());
  form.append("company", payload.company.trim());
  form.append("comment", payload.comment.trim());
  form.append("sum_amount", payload.sumRubles ? String(Number(payload.sumRubles) * 100) : "0");
  if (payload.startDate) form.append("start_date", payload.startDate);
  form.append("deadline", payload.deadline);
  if (payload.responsesDeadline) form.append("responses_deadline", `${payload.responsesDeadline}T23:59`);
  form.append("requires_expert", String(payload.requiresExpert));
  form.append("requires_license", String(payload.requiresLicense));
  form.append("badge_codes_json", JSON.stringify(payload.badgeCodes));
  if (files.technical) form.append("technical_files", files.technical);
  if (files.contract) form.append("contract_files", files.contract);
  if (files.company) form.append("company_files", files.company);
  for (const file of files.other) form.append("other_files", file);
  return apiJson("/orders/create-with-files", { method: "POST", body: form });
}
