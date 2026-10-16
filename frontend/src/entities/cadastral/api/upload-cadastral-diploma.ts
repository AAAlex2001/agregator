import { uploadFile } from "@/shared/api/upload-file";
import type { CadastralProfile } from "../model/types";

/** Заменяет диплом инженера и возвращает анкету с новым файлом. */
export async function uploadCadastralDiploma(
  file: File,
): Promise<CadastralProfile> {
  const response = await uploadFile(
    "/directions/cadastral/profile/diploma",
    file,
    "Не удалось загрузить диплом",
  );

  return response.json();
}
