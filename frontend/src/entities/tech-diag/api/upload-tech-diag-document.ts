import { uploadFile } from "@/shared/api/upload-file";
import type { TechDiagProfile } from "../model/types";

/** Добавляет квалификационное удостоверение к анкете специалиста. */
export async function uploadTechDiagDocument(
  file: File,
): Promise<TechDiagProfile> {
  const response = await uploadFile(
    "/directions/tech-diag/expert-profile/documents",
    file,
    "Не удалось загрузить документ",
  );

  return response.json();
}
