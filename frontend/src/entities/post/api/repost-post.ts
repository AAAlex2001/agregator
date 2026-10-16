import { request } from "@/shared/api/request";
import type { Post } from "../model/types";

/** Публикует репост, при необходимости с комментарием. */
export async function repostPost(id: number, html: string): Promise<Post> {
  const response = await request(`/posts/${id}/repost`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ html }),
    errorMessage: "Не удалось опубликовать репост",
  });

  return response.json();
}
