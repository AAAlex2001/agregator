import { API_URL, SERVER_API_URL } from "@/source/shared/api/config";
import { readErrorMessage } from "@/source/shared/api/errorMessage";
import { fetchWithSession } from "@/source/shared/api/session";
import type { ArticleComment } from "../model/types";

export async function fetchComments(
  articleId: number,
  opts: { server?: boolean } = {},
): Promise<ArticleComment[]> {
  const target = `${opts.server ? SERVER_API_URL : API_URL}/public/articles/${articleId}/comments`;
  const response = opts.server ? await fetch(target, { cache: "no-store" }) : await fetchWithSession(target);
  if (!response.ok) throw new Error(await readErrorMessage(response, "Не удалось загрузить комментарии"));
  const data = await response.json();
  return data.items;
}

export async function postComment(
  articleId: number,
  text: string,
  parentId: number | null,
): Promise<ArticleComment> {
  const response = await fetchWithSession(`${API_URL}/public/articles/${articleId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, parent_id: parentId }),
  });
  if (!response.ok) throw new Error(await readErrorMessage(response, "Не удалось отправить комментарий"));
  return response.json();
}

export async function deleteComment(commentId: number): Promise<void> {
  const response = await fetchWithSession(`${API_URL}/public/articles/comments/${commentId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error(await readErrorMessage(response, "Не удалось удалить комментарий"));
}
