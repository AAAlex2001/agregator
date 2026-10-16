import { request } from "@/shared/api/request";
import type { Post, PostPayload } from "../model/types";

/** Сохраняет изменения своей публикации. */
export async function updatePost(id: number, payload: PostPayload): Promise<Post> {
  const response = await request(`/posts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    errorMessage: "Не удалось сохранить изменения",
  });

  return response.json();
}
