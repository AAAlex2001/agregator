import { request } from "@/shared/api/request";
import type { PostLikes } from "../model/types";

/** Ставит или убирает лайк публикации и возвращает новый счётчик. */
export async function togglePostLike(id: number, liked: boolean): Promise<PostLikes> {
  const response = await request(`/posts/${id}/like`, {
    method: liked ? "POST" : "DELETE",
    errorMessage: "Не удалось изменить лайк",
  });

  return response.json();
}
