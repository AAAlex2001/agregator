import { json, send } from "@/source/shared/api/request";
import type { Post, PostPayload } from "../model/types";

/** Публикует пост или сохраняет черновик. */
export async function createPost(payload: PostPayload): Promise<Post> {
  const response = await send(
    "/posts",
    json("POST", payload),
    "Не удалось сохранить публикацию",
  );
  return response.json();
}

/** Сохраняет изменения своей публикации. */
export async function updatePost(id: number, payload: PostPayload): Promise<Post> {
  const response = await send(
    `/posts/${id}`,
    json("PUT", payload),
    "Не удалось сохранить изменения",
  );
  return response.json();
}

/** Удаляет свою публикацию или репост. */
export async function deletePost(id: number): Promise<void> {
  await send(`/posts/${id}`, { method: "DELETE" }, "Не удалось удалить публикацию");
}

/** Публикует репост, при необходимости с комментарием. */
export async function repostPost(id: number, html: string): Promise<Post> {
  const response = await send(
    `/posts/${id}/repost`,
    json("POST", { html }),
    "Не удалось опубликовать репост",
  );
  return response.json();
}
