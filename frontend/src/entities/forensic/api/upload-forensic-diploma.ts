import { uploadFile } from "@/shared/api/upload-file";
import type { ForensicProfile } from "../model/types";

/** Заменяет диплом судебного эксперта и возвращает обновлённую анкету. */
export async function uploadForensicDiploma(
  file: File,
): Promise<ForensicProfile> {
  const response = await uploadFile(
    "/directions/forensic/profile/diploma",
    file,
    "Не удалось загрузить диплом",
  );

  return response.json();
}
