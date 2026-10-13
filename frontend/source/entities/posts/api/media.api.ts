import { send, upload } from "@/source/shared/api/request";
import type { PostMedia } from "../model/types";

/** Загружает фото или видео; вид файла сервер определяет по содержимому. */
export async function uploadPostMedia(file: File): Promise<PostMedia> {
  const response = await upload("/posts/media", file, "Не удалось загрузить файл");
  return response.json();
}

/** Удаляет файл, который ещё не прикреплён к публикации. */
export async function deletePostMedia(id: number): Promise<void> {
  await send(`/posts/media/${id}`, { method: "DELETE" }, "Не удалось удалить файл");
}
