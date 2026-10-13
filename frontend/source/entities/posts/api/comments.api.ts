import { json, send } from "@/source/shared/api/request";
import { POSTS_PAGE_SIZE, type PostComment, type PostLikes, type ThreadPage } from "../model/types";

/** Страница веток обсуждения: корневые комментарии с ответами. */
export async function fetchThreads(postId: number, offset: number): Promise<ThreadPage> {
  const response = await send(
    `/posts/${postId}/comments?limit=${POSTS_PAGE_SIZE}&offset=${offset}`,
    {},
    "Не удалось загрузить комментарии",
  );
  return response.json();
}

/** Отправляет комментарий или ответ. */
export async function createComment(postId: number, text: string, replyToId: number | null): Promise<PostComment> {
  const response = await send(
    `/posts/${postId}/comments`,
    json("POST", { text, reply_to_id: replyToId }),
    "Не удалось отправить комментарий",
  );
  return response.json();
}

/** Сохраняет исправленный комментарий. */
export async function updateComment(id: number, text: string): Promise<PostComment> {
  const response = await send(`/posts/comments/${id}`, json("PUT", { text }), "Не удалось изменить комментарий");
  return response.json();
}

/** Удаляет комментарий вместе с ответами. */
export async function deleteComment(id: number): Promise<void> {
  await send(`/posts/comments/${id}`, { method: "DELETE" }, "Не удалось удалить комментарий");
}

/** Ставит или убирает лайк комментария. */
export async function toggleCommentLike(id: number, liked: boolean): Promise<PostLikes> {
  const response = await send(
    `/posts/comments/${id}/like`,
    { method: liked ? "POST" : "DELETE" },
    "Не удалось изменить лайк",
  );
  return response.json();
}

/** Отправляет жалобу на комментарий модератору. */
export async function reportComment(id: number, reason: string): Promise<void> {
  await send(`/posts/comments/${id}/report`, json("POST", { reason }), "Не удалось отправить жалобу");
}
