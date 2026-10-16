import { request } from "@/shared/api/request";

/** Отправляет модератору жалобу на публикацию. */
export async function reportPost(id: number, reason: string): Promise<void> {
  await request(`/posts/${id}/report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reason }),
    errorMessage: "Не удалось отправить жалобу",
  });
}
