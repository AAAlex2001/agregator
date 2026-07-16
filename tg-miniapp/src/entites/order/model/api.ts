import { apiJson } from "@/shared/services/api";
import { toKopecks } from "@/shared/lib/format";
import type { OrderDocuments, OrderList } from "./types";
import type { OrderWorkType } from "./work-types";

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
  workType: OrderWorkType;
  badgeCodes: string[];
  copySourceOrderId?: number | null;
  copyDocuments?: OrderDocuments;
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
  form.append("sum_amount", String(toKopecks(payload.sumRubles)));
  if (payload.startDate) form.append("start_date", payload.startDate);
  form.append("deadline", payload.deadline);
  if (payload.responsesDeadline) form.append("responses_deadline", payload.responsesDeadline);
  form.append("requires_expert", String(payload.requiresExpert));
  form.append("requires_license", String(payload.requiresLicense));
  form.append("work_type", payload.workType);
  form.append("badge_codes_json", JSON.stringify(payload.badgeCodes));
  if (payload.copySourceOrderId && payload.copyDocuments) {
    form.append("copy_source_order_id", String(payload.copySourceOrderId));
    form.append("copy_documents_json", JSON.stringify(payload.copyDocuments));
  }
  if (files.technical) form.append("technical_files", files.technical);
  if (files.contract) form.append("contract_files", files.contract);
  if (files.company) form.append("company_files", files.company);
  for (const file of files.other) form.append("other_files", file);
  return apiJson("/orders/create-with-files", { method: "POST", body: form });
}

export function deleteOrder(orderId: number): Promise<unknown> {
  return apiJson(`/orders/${orderId}`, { method: "DELETE" });
}

export interface UpdateOrderPayload {
  title: string;
  company: string;
  comment: string;
  sumRubles: string;
  startDate: string;
  deadline: string;
  responsesDeadline: string;
  badgeCodes: string[];
  keepDocuments: OrderDocuments;
  notifyResponders: boolean;
  copySourceOrderId?: number | null;
  requiresExpert: boolean;
  requiresLicense: boolean;
  workType: OrderWorkType;
}

export function updateOrder(orderId: number, payload: UpdateOrderPayload, newFiles: File[]): Promise<unknown> {
  const form = new FormData();
  form.append("title", payload.title.trim());
  form.append("company", payload.company.trim());
  form.append("comment", payload.comment.trim());
  form.append("sum_amount", String(toKopecks(payload.sumRubles)));
  if (payload.startDate) form.append("start_date", payload.startDate);
  form.append("deadline", payload.deadline);
  if (payload.responsesDeadline) form.append("responses_deadline", payload.responsesDeadline);
  form.append("badge_codes_json", JSON.stringify(payload.badgeCodes));
  form.append("requires_expert", String(payload.requiresExpert));
  form.append("requires_license", String(payload.requiresLicense));
  form.append("work_type", payload.workType);
  form.append("keep_documents_json", JSON.stringify(payload.copySourceOrderId ? {} : payload.keepDocuments));
  if (payload.copySourceOrderId) {
    form.append("copy_source_order_id", String(payload.copySourceOrderId));
    form.append("copy_documents_json", JSON.stringify(payload.keepDocuments));
  }
  form.append("notify_responders", String(payload.notifyResponders));
  for (const file of newFiles) form.append("other_files", file);
  return apiJson(`/orders/${orderId}/update-with-files`, { method: "PATCH", body: form });
}
