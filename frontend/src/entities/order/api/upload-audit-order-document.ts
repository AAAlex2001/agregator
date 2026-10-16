import { uploadFile } from "@/shared/api/upload-file";
import type { AuditOrderDocument } from "../model/details/audit";

/** Загружает СТО или свидетельство ОПО перед сохранением заказа на аудит. */
export async function uploadAuditOrderDocument(
  file: File,
): Promise<AuditOrderDocument> {
  const response = await uploadFile(
    "/directions/audit/order-files",
    file,
    "Не удалось загрузить файл",
  );

  return response.json();
}
