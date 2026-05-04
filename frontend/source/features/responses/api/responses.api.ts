import { API_URL } from "@/source/shared/api/config";
import { fetchWithSession } from "@/source/shared/api/session";
import { stableMultipartFetch } from "@/shared/lib/stableMultipartFetch";
import type { ResponseTabKey, ResponsesApiList, CustomerSortBy, SortDir } from "@/source/entities/response";

export async function fetchResponses(
  tab: ResponseTabKey,
  sortBy: CustomerSortBy = "created_at",
  sortDir: SortDir = "desc",
): Promise<ResponsesApiList> {
  const url = `${API_URL}/responses?tab=${tab}&sort_by=${sortBy}&sort_dir=${sortDir}&skip=0&limit=50`;
  const res = await fetchWithSession(url);
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || "Не удалось загрузить отклики");
  return res.json();
}


export async function updateStatus(id: number, status: string, rejectionReason?: string): Promise<void> {
  const fd = new FormData();
  if (rejectionReason) fd.append("rejection_reason", rejectionReason);
  const url = `${API_URL}/responses/${id}/status?new_status=${status}`;
  const res = await fetchWithSession(url, { method: "PATCH", body: fd });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || "Ошибка обновления статуса");
}


export async function deleteResponse(id: number): Promise<void> {
  const res = await fetchWithSession(`${API_URL}/responses/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || "Не удалось отозвать отклик");
}

interface EditPayload {
  comment: string;
  sumAmount: number;
  deadline: string;
  files?: File[];
  keepFiles?: string[];
}

export async function editResponse(id: number, p: EditPayload): Promise<void> {
  const build = (files: File[]) => {
    const fd = new FormData();
    fd.append("comment", p.comment);
    fd.append("proposed_sum_amount", String(p.sumAmount));
    fd.append("proposed_deadline", p.deadline);
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
