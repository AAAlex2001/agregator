import { json, send } from "@/source/shared/api/request";
import type { Post, PostPayload } from "../model/types";

/** Загружает публикацию или собственный черновик. */
export async function fetchPost(id: number, signal?: AbortSignal): Promise<Post> {
  const response = await send(
    `/posts/${id}`,
    { signal, cache: "no-store" },
    "Публикация не найдена",
  );
  return response.json();
}

/** Публикует пост или сохраняет черновик. */
export async function createPost(payload: PostPayload): Promise<Post> {
  const response = await send("/posts", json("POST", payload), "Не удалось сохранить публикацию");
  return response.json();
}

/** Обновляет собственную публикацию. */
export async function updatePost(id: number, payload: PostPayload): Promise<Post> {
  const response = await send(
    `/posts/${id}`,
    json("PUT", payload),
    "Не удалось сохранить изменения",
  );
  return response.json();
}

/** Удаляет собственную публикацию. */
export async function deletePost(id: number): Promise<void> {
  await send(`/posts/${id}`, { method: "DELETE" }, "Не удалось удалить публикацию");
}

/** Создаёт репост, при необходимости с комментарием. */
export async function repostPost(id: number, html: string): Promise<Post> {
  const response = await send(
    `/posts/${id}/repost`,
    json("POST", { html }),
    "Не удалось опубликовать репост",
  );
  return response.json();
}
