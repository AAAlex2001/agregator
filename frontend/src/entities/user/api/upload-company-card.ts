import { uploadFile } from "@/shared/api/upload-file";
import type { UserProfile } from "../model/types";

/** Заменяет карточку предприятия в профиле держателя документов. */
export async function uploadCompanyCard(file: File): Promise<UserProfile> {
  const response = await uploadFile(
    "/settings/company-card",
    file,
    "Не удалось загрузить карточку предприятия",
  );

  return response.json();
}

