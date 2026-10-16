import { uploadFile } from "@/shared/api/upload-file";
import type { UserProfile } from "../model/types";

/** Заменяет файл лицензии на экспертизу промышленной безопасности. */
export async function uploadLicenseFile(file: File): Promise<UserProfile> {
  const response = await uploadFile(
    "/settings/license-file",
    file,
    "Не удалось загрузить файл лицензии",
  );

  return response.json();
}

