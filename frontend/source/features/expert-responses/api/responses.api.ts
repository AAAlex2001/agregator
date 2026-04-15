import { fetchWithSession } from "@/source/shared/api/session";
import { stableMultipartFetch } from "@/shared/lib/stableMultipartFetch";
import type { ResponseTabKey, ResponsesApiList } from "@/source/entities/response";

const API = process.env.NEXT_PUBLIC_API_URL || "/api";

export async function fetchResponses(tab: ResponseTabKey): Promise<ResponsesApiList> {
  const res = await fetchWithSession(`${API}/responses?tab=${tab}&skip=0&limit=50`);
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || "Не удалось загрузить отклики");
  return res.json();
}

export async function updateStatus(id: number, status: string): Promise<void> {
  const res = await fetchWithSession(`${API}/responses/${id}/status?new_status=${status}`, { method: "PATCH" });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || "Ошибка обновления статуса");
}

export async function deleteResponse(id: number): Promise<void> {
  const res = await fetchWithSession(`${API}/responses/${id}`, { method: "DELETE" });
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
    input: `${API}/responses/${id}`,
    method: "PUT",
    files: p.files ?? [],
    buildBody: build,
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || "Не удалось обновить отклик");
}
