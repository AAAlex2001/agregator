import { request } from "@/shared/api/request";
import type { Post, PostPayload } from "../model/types";

/** Публикует пост или сохраняет его черновиком. */
export async function createPost(payload: PostPayload): Promise<Post> {
  const response = await request("/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    errorMessage: "Не удалось сохранить публикацию",
  });

  return response.json();
}
