import { uploadFile } from "@/shared/api/upload-file";
import type { PostMedia } from "../model/types";

/** Загружает фото или видео; вид файла сервер определяет по содержимому. */
export async function uploadPostMedia(file: File): Promise<PostMedia> {
  const response = await uploadFile("/posts/media", file, "Не удалось загрузить файл");

  return response.json();
}
