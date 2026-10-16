import { request } from "@/shared/api/request";
import type { PostComment } from "../model/types";

/** Отправляет комментарий к публикации или ответ на комментарий. */
export async function createPostComment(
  postId: number,
  text: string,
  replyToId: number | null,
): Promise<PostComment> {
  const response = await request(`/posts/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      reply_to_id: replyToId,
    }),
    errorMessage: "Не удалось отправить комментарий",
  });

  return response.json();
}
