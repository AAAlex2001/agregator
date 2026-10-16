import { request } from "@/shared/api/request";

/** Удаляет собственный комментарий вместе с ответами на него. */
export async function deleteArticleComment(commentId: number): Promise<void> {
  await request(`/public/articles/comments/${commentId}`, {
    method: "DELETE",
    errorMessage: "Не удалось удалить комментарий",
  });
}

