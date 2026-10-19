import { request } from "@/shared/api/request";

/** Удаляет свою публикацию или репост вместе с комментариями, по желанию — и из Telegram. */
export async function deletePost(id: number, fromChannels: boolean): Promise<void> {
  await request(`/posts/${id}?from_channels=${fromChannels}`, {
    method: "DELETE",
    errorMessage: "Не удалось удалить публикацию",
  });
}
