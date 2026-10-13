import { API_URL } from "@/source/shared/api/config";
import { json, send } from "@/source/shared/api/request";
import type { PostLikes } from "../model/types";

/** Ставит или убирает лайк. */
export async function togglePostLike(id: number, liked: boolean): Promise<PostLikes> {
  const response = await send(`/posts/${id}/like`, { method: liked ? "POST" : "DELETE" }, "Не удалось изменить лайк");
  return response.json();
}

/** Добавляет публикацию в сохранённое или убирает её. */
export async function togglePostSave(id: number, saved: boolean): Promise<void> {
  await send(`/posts/${id}/save`, { method: saved ? "POST" : "DELETE" }, "Не удалось изменить сохранённое");
}

/** Подписывает на автора или отменяет подписку. */
export async function followPostAuthor(authorId: number, following: boolean): Promise<void> {
  await send(
    `/posts/authors/${authorId}/follow`,
    { method: following ? "POST" : "DELETE" },
    "Не удалось изменить подписку",
  );
}

/** Отправляет жалобу на публикацию модератору. */
export async function reportPost(id: number, reason: string): Promise<void> {
  await send(`/posts/${id}/report`, json("POST", { reason }), "Не удалось отправить жалобу");
}

/** Засчитывает просмотр. Отправляется фоном и не мешает уходу со страницы. */
export function countPostView(id: number): void {
  navigator.sendBeacon(`${API_URL}/posts/${id}/view`);
}
