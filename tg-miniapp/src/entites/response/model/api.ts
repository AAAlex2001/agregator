import { apiJson } from "@/shared/services/api";
import type { CustomerSortBy, EditResponseData, ResponseList, ResponseTab, SortDir } from "./types";

export function listResponses(
  tab: ResponseTab,
  sortBy: CustomerSortBy = "created_at",
  sortDir: SortDir = "desc",
  skip = 0,
  limit = 50,
): Promise<ResponseList> {
  return apiJson<ResponseList>(`/responses?tab=${tab}&sort_by=${sortBy}&sort_dir=${sortDir}&skip=${skip}&limit=${limit}`);
}

export function withdrawResponse(id: number): Promise<unknown> {
  return apiJson(`/responses/${id}`, { method: "DELETE" });
}

export function restoreResponse(id: number): Promise<unknown> {
  return apiJson(`/responses/${id}/restore`, { method: "POST" });
}

export function deleteRejectedResponse(id: number): Promise<unknown> {
  return apiJson(`/responses/${id}/rejected`, { method: "DELETE" });
}

export function setResponseStatus(id: number, status: string, reason?: string): Promise<unknown> {
  const init: RequestInit = { method: "PATCH" };
  if (reason) {
    const form = new FormData();
    form.append("rejection_reason", reason);
    init.body = form;
  }
  return apiJson(`/responses/${id}/status?new_status=${status}`, init);
}

export function editResponse(id: number, data: EditResponseData): Promise<unknown> {
  const form = new FormData();
  form.append("comment", data.comment);
  form.append("proposed_sum_amount", String(data.proposed_sum_amount));
  form.append("proposed_start_date", data.proposed_start_date);
  form.append("proposed_deadline", data.proposed_deadline);
  form.append("vat_kind", data.vat_kind);
  form.append("keep_files", JSON.stringify(data.keep_files));
  for (const file of data.files) form.append("files", file);
  return apiJson(`/responses/${id}`, { method: "PUT", body: form });
}
