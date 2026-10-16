import { uploadFile } from "@/shared/api/upload-file";
import type { CadastralProfile } from "../model/types";

/** Добавляет дополнительный документ инженера. */
export async function uploadCadastralDocument(
  file: File,
): Promise<CadastralProfile> {
  const response = await uploadFile(
    "/directions/cadastral/profile/documents",
    file,
    "Не удалось загрузить документ",
  );

  return response.json();
}
