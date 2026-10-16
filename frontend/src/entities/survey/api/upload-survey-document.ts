import { uploadFile } from "@/shared/api/upload-file";
import type { SurveyDocumentGroup, SurveyProfile } from "../model/types";

/** Добавляет один документ в выбранную группу и возвращает обновлённую анкету. */
export async function uploadSurveyDocument(
  group: SurveyDocumentGroup,
  file: File,
): Promise<SurveyProfile> {
  const response = await uploadFile(
    `/directions/survey/expert-profile/documents?group=${group}`,
    file,
    "Не удалось загрузить документ",
  );

  return response.json();
}
