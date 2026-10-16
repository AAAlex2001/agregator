import { uploadFile } from "@/shared/api/upload-file";
import type { EcologyProfile } from "../model/types";

/** Добавляет документ о квалификации и возвращает обновлённую анкету. */
export async function uploadEcologyDocument(
  file: File,
): Promise<EcologyProfile> {
  const response = await uploadFile(
    "/directions/ecology/expert-profile/documents",
    file,
    "Не удалось загрузить документ",
  );

  return response.json();
}
