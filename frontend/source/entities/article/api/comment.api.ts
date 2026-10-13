import { SERVER_API_URL } from "@/source/shared/api/config";
import { json, send } from "@/source/shared/api/request";
import type { ArticleComment } from "../model/types";

/** Комментарии к статье. На сервере Next читаются без сессии, в браузере — с ней, чтобы пометить свои. */
export async function fetchComments(articleId: number, options: { server?: boolean } = {}): Promise<ArticleComment[]> {
  const path = `/public/articles/${articleId}/comments`;
  const response = options.server
    ? await fetch(`${SERVER_API_URL}${path}`, { cache: "no-store" })
    : await send(path, {}, "Не удалось загрузить комментарии");
  if (!response.ok) throw new Error(`Не удалось загрузить комментарии: ${response.status}`);
  const data: { items: ArticleComment[] } = await response.json();
  return data.items;
}

/** Оставить комментарий или ответ на комментарий. */
export async function postComment(articleId: number, text: string, parentId: number | null): Promise<ArticleComment> {
  const response = await send(
    `/public/articles/${articleId}/comments`,
    json("POST", { text, parent_id: parentId }),
    "Не удалось отправить комментарий",
  );
  return response.json();
}

/** Удалить свой комментарий вместе с ответами на него. */
export async function deleteComment(commentId: number): Promise<void> {
  await send(`/public/articles/comments/${commentId}`, { method: "DELETE" }, "Не удалось удалить комментарий");
}
