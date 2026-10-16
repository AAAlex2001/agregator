import { request } from "@/shared/api/request";

/** Удаляет свой комментарий вместе с ответами на него. */
export async function deletePostComment(id: number): Promise<void> {
  await request(`/posts/comments/${id}`, {
    method: "DELETE",
    errorMessage: "Не удалось удалить комментарий",
  });
}
