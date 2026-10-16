import { uploadFile } from "@/shared/api/upload-file";
import type { AuditExpertProfile } from "../model/types";

/** Добавляет диплом, аттестат или документ о курсах в анкету аудитора. */
export async function uploadAuditDocument(file: File): Promise<AuditExpertProfile> {
  const response = await uploadFile(
    "/directions/audit/expert-profile/documents",
    file,
    "Не удалось загрузить документ",
  );

  return response.json();
}
