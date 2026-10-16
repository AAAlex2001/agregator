import { uploadFile } from "@/shared/api/upload-file";
import type { UserProfile } from "../model/types";

/** Заменяет свидетельство об аккредитации лаборатории. */
export async function uploadLabAccreditationFile(file: File): Promise<UserProfile> {
  const response = await uploadFile(
    "/settings/lab-accreditation-file",
    file,
    "Не удалось загрузить файл аккредитации",
  );

  return response.json();
}

