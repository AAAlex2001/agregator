import { request } from "@/shared/api/request";

/** Отправляет модератору жалобу на комментарий к публикации. */
export async function reportPostComment(id: number, reason: string): Promise<void> {
  await request(`/posts/comments/${id}/report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reason }),
    errorMessage: "Не удалось отправить жалобу",
  });
}
