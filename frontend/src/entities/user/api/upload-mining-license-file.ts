import { uploadFile } from "@/shared/api/upload-file";
import type { UserProfile } from "../model/types";

/** Заменяет файл лицензии на маркшейдерские работы. */
export async function uploadMiningLicenseFile(file: File): Promise<UserProfile> {
  const response = await uploadFile(
    "/settings/mining-license-file",
    file,
    "Не удалось загрузить файл лицензии маркшейдера",
  );

  return response.json();
}

