import { json, send } from "@/source/shared/api/request";
import type { PostComment, PostLikes, ThreadPage } from "../model/types";

/** Загружает комментарии вместе с ответами. */
export async function fetchThreads(
  postId: number,
  limit: number,
  offset: number,
  signal?: AbortSignal,
): Promise<ThreadPage> {
  const response = await send(
    `/posts/${postId}/comments?limit=${limit}&offset=${offset}`,
    { signal, cache: "no-store" },
    "Не удалось загрузить комментарии",
  );
  return response.json();
}
/** Отправляет комментарий или ответ. */
export async function createComment(
  postId: number,
  text: string,
  replyToId: number | null,
): Promise<PostComment> {
  const response = await send(
    `/posts/${postId}/comments`,
    json("POST", { text, reply_to_id: replyToId }),
    "Не удалось отправить комментарий",
  );
  return response.json();
}
/** Сохраняет исправленный комментарий. */
export async function updateComment(id: number, text: string): Promise<PostComment> {
  const response = await send(
    `/posts/comments/${id}`,
    json("PUT", { text }),
    "Не удалось изменить комментарий",
  );
  return response.json();
}
/** Удаляет комментарий вместе с ответами. */
export async function deleteComment(id: number): Promise<void> {
  await send(`/posts/comments/${id}`, { method: "DELETE" }, "Не удалось удалить комментарий");
}
/** Добавляет или убирает лайк у комментария. */
export async function toggleCommentLike(id: number, liked: boolean): Promise<PostLikes> {
  const response = await send(
    `/posts/comments/${id}/like`,
    { method: liked ? "POST" : "DELETE" },
    "Не удалось изменить лайк",
  );
  return response.json();
}
/** Отправляет жалобу на комментарий. */
export async function reportComment(id: number, reason: string): Promise<void> {
  await send(
    `/posts/comments/${id}/report`,
    json("POST", { reason }),
    "Не удалось отправить жалобу",
  );
}
