import { request } from "@/shared/api/request";
import type { PostComment } from "../model/types";

/** Сохраняет исправленный текст своего комментария. */
export async function updatePostComment(id: number, text: string): Promise<PostComment> {
  const response = await request(`/posts/comments/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
    errorMessage: "Не удалось изменить комментарий",
  });

  return response.json();
}
