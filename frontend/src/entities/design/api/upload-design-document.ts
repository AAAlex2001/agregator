import { uploadFile } from "@/shared/api/upload-file";
import type { DesignDocumentGroup, DesignProfile } from "../model/types";

/** Добавляет один документ в выбранную группу и возвращает обновлённую анкету. */
export async function uploadDesignDocument(
  group: DesignDocumentGroup,
  file: File,
): Promise<DesignProfile> {
  const response = await uploadFile(
    `/directions/design/expert-profile/documents?group=${group}`,
    file,
    "Не удалось загрузить документ",
  );

  return response.json();
}
