import { uploadFile } from "@/shared/api/upload-file";
import type { ForensicProfile } from "../model/types";

/** Прикладывает документ о дополнительном образовании эксперта. */
export async function uploadForensicDocument(
  file: File,
): Promise<ForensicProfile> {
  const response = await uploadFile(
    "/directions/forensic/profile/documents",
    file,
    "Не удалось загрузить документ",
  );

  return response.json();
}
