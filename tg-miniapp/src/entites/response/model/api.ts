import { apiJson } from "@/shared/services/api";

export type ResponseStatus =
  | "REVIEW"
  | "REJECTED"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "WITHDRAWN_BY_EXPERT";

export type ResponseTab =
  | "all"
  | "review"
  | "in_progress"
  | "rejected"
  | "accepted"
  | "withdrawn_by_expert";

export type VatKind = "NONE" | "VAT_5" | "VAT_7" | "VAT_22";

export const VAT_LABEL: Record<VatKind, string> = {
  NONE: "Без НДС",
  VAT_5: "НДС 5%",
  VAT_7: "НДС 7%",
  VAT_22: "НДС 22%",
};

export interface ResponseBadge {
  text: string;
  variant: string;
}

export interface ExpertResponse {
  id: number;
  order_id: number;
  status: ResponseStatus;
  date: string;
  comment: string;
  proposed_sum: string;
  proposed_start_date: string;
  proposed_deadline: string;
  proposed_sum_amount_raw: number;
  proposed_start_date_raw: string;
  proposed_deadline_raw: string;
  vat_kind: VatKind;
  response_files: string[];
  order_title: string;
  order_sum: string;
  order_responses_deadline: string | null;
  order_created_at: string;
  customer_name: string;
  customer_company: string;
  badges: ResponseBadge[];
}

export interface ResponseCounters {
  all: number;
  review: number;
  in_progress: number;
  rejected: number;
  accepted: number;
  withdrawn_by_expert: number;
}

export interface ResponseList {
  items: ExpertResponse[];
  has_more: boolean;
  counters: ResponseCounters;
}

export function listResponses(tab: ResponseTab, skip = 0, limit = 50): Promise<ResponseList> {
  return apiJson<ResponseList>(`/responses?tab=${tab}&skip=${skip}&limit=${limit}`);
}

export function withdrawResponse(id: number): Promise<unknown> {
  return apiJson(`/responses/${id}`, { method: "DELETE" });
}

export function restoreResponse(id: number): Promise<unknown> {
  return apiJson(`/responses/${id}/restore`, { method: "POST" });
}

export interface EditResponseData {
  comment: string;
  proposed_sum_amount: number;
  proposed_start_date: string;
  proposed_deadline: string;
  vat_kind: VatKind;
  keep_files: string[];
  files: File[];
}

export function editResponse(id: number, data: EditResponseData): Promise<unknown> {
  const form = new FormData();
  form.append("comment", data.comment);
  form.append("proposed_sum_amount", String(data.proposed_sum_amount));
  if (data.proposed_start_date) form.append("proposed_start_date", data.proposed_start_date);
  form.append("proposed_deadline", data.proposed_deadline);
  form.append("vat_kind", data.vat_kind);
  form.append("keep_files", JSON.stringify(data.keep_files));
  for (const file of data.files) form.append("files", file);
  return apiJson(`/responses/${id}`, { method: "PUT", body: form });
}
