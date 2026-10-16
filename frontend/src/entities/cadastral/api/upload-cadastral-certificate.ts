import { uploadFile } from "@/shared/api/upload-file";
import type { CadastralProfile } from "../model/types";

/** Заменяет квалификационный аттестат кадастрового инженера. */
export async function uploadCadastralCertificate(
  file: File,
): Promise<CadastralProfile> {
  const response = await uploadFile(
    "/directions/cadastral/profile/certificate",
    file,
    "Не удалось загрузить аттестат",
  );

  return response.json();
}
