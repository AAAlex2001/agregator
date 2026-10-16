import { request } from "@/shared/api/request";

/** Удаляет файл, который ещё не прикреплён к публикации. */
export async function deletePostMedia(id: number): Promise<void> {
  await request(`/posts/media/${id}`, {
    method: "DELETE",
    errorMessage: "Не удалось удалить файл",
  });
}
