import { API_URL } from "@/source/shared/api/config";
import { fetchWithSession } from "@/source/shared/api/session";
import { stableMultipartFetch } from "@/source/shared/lib/stableMultipartFetch";
import type { ResponseTabKey, ResponsesApiList, CustomerSortBy, SortDir } from "@/source/entities/response/model/types";

export async function fetchResponses(
  tab: ResponseTabKey,
  sortBy: CustomerSortBy = "created_at",
  sortDir: SortDir = "desc",
  skip = 0,
  limit = 50,
): Promise<ResponsesApiList> {
  const url = `${API_URL}/responses?tab=${tab}&sort_by=${sortBy}&sort_dir=${sortDir}&skip=${skip}&limit=${limit}`;
  const res = await fetchWithSession(url);
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || "Не удалось загрузить отклики");
  return res.json();
}


export async function updateStatus(id: number, status: string, rejectionReason?: string): Promise<void> {
  const url = `${API_URL}/responses/${id}/status?new_status=${status}`;
  const init: RequestInit = { method: "PATCH" };
  if (rejectionReason) {
    const fd = new FormData();
    fd.append("rejection_reason", rejectionReason);
    init.body = fd;
  }
  const res = await fetchWithSession(url, init);
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || "Ошибка обновления статуса");
}


export async function deleteResponse(id: number): Promise<void> {
  const res = await fetchWithSession(`${API_URL}/responses/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || "Не удалось отозвать отклик");
}

export async function restoreWithdrawnResponse(id: number): Promise<void> {
  const res = await fetchWithSession(`${API_URL}/responses/${id}/restore`, { method: "POST" });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || "Не удалось восстановить отклик");
}

export async function deleteRejectedResponse(id: number): Promise<void> {
  const res = await fetchWithSession(`${API_URL}/responses/${id}/rejected`, { method: "DELETE" });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || "Не удалось удалить отклик");
}

export async function deleteAllRejectedResponses(): Promise<number> {
  const res = await fetchWithSession(`${API_URL}/responses/rejected/all`, { method: "DELETE" });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || "Не удалось удалить отклики");
  const body = await res.json().catch(() => ({ deleted: 0 }));
  return Number(body.deleted ?? 0);
}

export interface EditPayload {
  comment: string;
  sumAmount: number;
  startDate?: string;
  deadline: string;
  vatKind: string;
  files?: File[];
  keepFiles?: string[];
}

export async function editResponse(id: number, p: EditPayload): Promise<void> {
  const build = (files: File[]) => {
    const fd = new FormData();
    fd.append("comment", p.comment);
    fd.append("proposed_sum_amount", String(p.sumAmount));
    if (p.startDate) fd.append("proposed_start_date", p.startDate);
    fd.append("proposed_deadline", p.deadline);
    fd.append("vat_kind", p.vatKind);
    fd.append("keep_files", JSON.stringify(p.keepFiles ?? []));
    for (const f of files) fd.append("files", f);
    return fd;
  };

  const res = await stableMultipartFetch({
    input: `${API_URL}/responses/${id}`,
    method: "PUT",
    files: p.files ?? [],
    buildBody: build,
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || "Не удалось обновить отклик");
}

export async function createReview(payload: { response_id: number; rating: number; comment: string }): Promise<void> {
  const res = await fetchWithSession(`${API_URL}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || "Не удалось оставить отзыв");
}
