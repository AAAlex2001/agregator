import { json, send } from "@/source/shared/api/request";
import type { PostLikes } from "../model/types";

/** Отправляет жалобу модератору. */
export async function reportPost(id: number, reason: string): Promise<void> {
  await send(`/posts/${id}/report`, json("POST", { reason }), "Не удалось отправить жалобу");
}

/** Учитывает просмотр публикации. */
export async function countPostView(id: number): Promise<void> {
  await send(`/posts/${id}/view`, { method: "POST" }, "Не удалось учесть просмотр");
}

/** Добавляет или убирает лайк. */
export async function togglePostLike(id: number, liked: boolean): Promise<PostLikes> {
  const response = await send(
    `/posts/${id}/like`,
    { method: liked ? "POST" : "DELETE" },
    "Не удалось изменить лайк",
  );
  return response.json();
}

/** Добавляет публикацию в сохранённое или убирает её. */
export async function togglePostSave(id: number, saved: boolean): Promise<void> {
  await send(
    `/posts/${id}/save`,
    { method: saved ? "POST" : "DELETE" },
    "Не удалось изменить сохранённое",
  );
}

/** Подписывает на автора или отменяет подписку. */
export async function followPostAuthor(id: number, following: boolean): Promise<void> {
  await send(
    `/posts/authors/${id}/follow`,
    { method: following ? "POST" : "DELETE" },
    "Не удалось изменить подписку",
  );
}
