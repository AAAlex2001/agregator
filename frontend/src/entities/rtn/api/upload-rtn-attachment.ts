import { uploadFile } from "@/shared/api/upload-file";
import type { RtnFile } from "../model/types";

/** Загружает один документ или изображение для обсуждения и ответов РТН. */
export async function uploadRtnAttachment(file: File): Promise<RtnFile> {
  const response = await uploadFile(
    "/public/rtn/comments/upload-attachment",
    file,
    "Не удалось загрузить файл",
  );

  return response.json();
}
