import { request } from "@/shared/api/request";

/** Удаляет свою публикацию или репост вместе с комментариями. */
export async function deletePost(id: number): Promise<void> {
  await request(`/posts/${id}`, {
    method: "DELETE",
    errorMessage: "Не удалось удалить публикацию",
  });
}
