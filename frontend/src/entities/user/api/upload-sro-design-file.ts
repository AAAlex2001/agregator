import { uploadFile } from "@/shared/api/upload-file";
import type { UserProfile } from "../model/types";

/** Заменяет выписку из реестра членов СРО проектировщиков. */
export async function uploadSroDesignFile(file: File): Promise<UserProfile> {
  const response = await uploadFile(
    "/settings/sro-design-file",
    file,
    "Не удалось загрузить файл выписки СРО",
  );

  return response.json();
}

