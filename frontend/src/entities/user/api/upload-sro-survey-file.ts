import { uploadFile } from "@/shared/api/upload-file";
import type { UserProfile } from "../model/types";

/** Заменяет выписку из реестра членов СРО изыскателей. */
export async function uploadSroSurveyFile(file: File): Promise<UserProfile> {
  const response = await uploadFile(
    "/settings/sro-survey-file",
    file,
    "Не удалось загрузить файл выписки СРО",
  );

  return response.json();
}

