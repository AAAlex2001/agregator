import type { SortDir } from "@/source/shared/ui/SortPills";
import { API_URL, SERVER_API_URL } from "@/source/shared/api/config";
import { readErrorMessage } from "@/source/shared/api/errorMessage";
import { fetchWithSession } from "@/source/shared/api/session";
import type { CommentReactionValue, RtnComment, RtnCommentAttachment, RtnCommentSortBy } from "../model/types";

export async function fetchRtnComments(
  clarificationId: number,
  opts: { sortBy?: RtnCommentSortBy | null; sortDir?: SortDir | null; server?: boolean } = {},
): Promise<RtnComment[]> {
  const params = new URLSearchParams();
  if (opts.sortBy) params.set("sort_by", opts.sortBy);
  if (opts.sortDir) params.set("sort_dir", opts.sortDir);
  const query = params.toString();
  const base = `${opts.server ? SERVER_API_URL : API_URL}/public/rtn/clarifications/${clarificationId}/comments`;
  const target = query ? `${base}?${query}` : base;
  const response = opts.server ? await fetch(target, { cache: "no-store" }) : await fetchWithSession(target);
  if (!response.ok) throw new Error(await readErrorMessage(response, "Не удалось загрузить обсуждение"));
  const data = await response.json();
  return data.items;
}

export async function postRtnComment(
  clarificationId: number,
  text: string,
  parentId: number | null,
  attachments: RtnCommentAttachment[] = [],
): Promise<RtnComment> {
  const response = await fetchWithSession(`${API_URL}/public/rtn/clarifications/${clarificationId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, parent_id: parentId, attachments }),
  });
  if (!response.ok) throw new Error(await readErrorMessage(response, "Не удалось отправить комментарий"));
  return response.json();
}

export async function uploadRtnCommentAttachment(file: File): Promise<RtnCommentAttachment> {
  const form = new FormData();
  form.append("file", file);
  const response = await fetchWithSession(`${API_URL}/public/rtn/comments/upload-attachment`, {
    method: "POST",
    body: form,
  });
  if (!response.ok) throw new Error(await readErrorMessage(response, "Не удалось загрузить файл"));
  return response.json();
}

export async function deleteRtnComment(commentId: number): Promise<void> {
  const response = await fetchWithSession(`${API_URL}/public/rtn/comments/${commentId}`, { method: "DELETE" });
  if (!response.ok) throw new Error(await readErrorMessage(response, "Не удалось удалить комментарий"));
}

export async function reactToRtnComment(
  commentId: number,
  value: CommentReactionValue,
): Promise<{ useful_count: number; clarification_count: number; agree_count: number; my_reaction: CommentReactionValue | null }> {
  const response = await fetchWithSession(`${API_URL}/public/rtn/comments/${commentId}/reaction`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ value }),
  });
  if (!response.ok) throw new Error(await readErrorMessage(response, "Не удалось сохранить реакцию"));
  return response.json();
}
