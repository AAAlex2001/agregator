import { request } from "@/shared/api/request";

/** Удаляет свой комментарий вместе с ответами на него. */
export async function deleteRtnComment(commentId: number): Promise<void> {
  await request(`/public/rtn/comments/${commentId}`, {
    method: "DELETE",
    errorMessage: "Не удалось удалить комментарий",
  });
}
