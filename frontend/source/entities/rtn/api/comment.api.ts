import { SERVER_API_URL } from "@/source/shared/api/config";
import { json, send, upload } from "@/source/shared/api/request";
import type { RtnFile } from "../model/clarification";
import type { RtnComment, RtnCommentCounters, RtnCommentReaction } from "../model/comment";

/** Обсуждение разъяснения. На сервере Next читается без сессии, в браузере — с ней, чтобы пометить свои комментарии. */
export async function fetchRtnComments(clarificationId: number, options: { server?: boolean } = {}): Promise<RtnComment[]> {
  const path = `/public/rtn/clarifications/${clarificationId}/comments`;
  const response = options.server
    ? await fetch(`${SERVER_API_URL}${path}`, { cache: "no-store" })
    : await send(path, {}, "Не удалось загрузить обсуждение");
  if (!response.ok) throw new Error(`Не удалось загрузить обсуждение: ${response.status}`);
  const data: { items: RtnComment[] } = await response.json();
  return data.items;
}

/** Оставить комментарий или ответ на комментарий. */
export async function postRtnComment(
  clarificationId: number,
  text: string,
  parentId: number | null,
  attachments: RtnFile[],
): Promise<RtnComment> {
  const response = await send(
    `/public/rtn/clarifications/${clarificationId}/comments`,
    json("POST", { text, parent_id: parentId, attachments }),
    "Не удалось отправить комментарий",
  );
  return response.json();
}

/** Удалить свой комментарий вместе с ответами на него. */
export async function deleteRtnComment(commentId: number): Promise<void> {
  await send(`/public/rtn/comments/${commentId}`, { method: "DELETE" }, "Не удалось удалить комментарий");
}

/** Отметить комментарий и получить новые счётчики. */
export async function reactToRtnComment(commentId: number, value: RtnCommentReaction): Promise<RtnCommentCounters> {
  const response = await send(`/public/rtn/comments/${commentId}/reaction`, json("POST", { value }), "Не удалось сохранить реакцию");
  return response.json();
}

/** Загрузить файл к комментарию или ответу на вопрос. */
export async function uploadRtnAttachment(file: File): Promise<RtnFile> {
  const response = await upload("/public/rtn/comments/upload-attachment", file, "Не удалось загрузить файл");
  return response.json();
}
