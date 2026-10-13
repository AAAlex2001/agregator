import { upload } from "@/source/shared/api/request";
import type { DirectionFile } from "../../shared/model/files";

/** Загрузить файл к заказу на аудит: свидетельство о регистрации ОПО или СТО. */
export async function uploadAuditOrderFile(file: File): Promise<DirectionFile> {
  const response = await upload("/directions/audit/order-files", file, "Не удалось загрузить файл");
  return response.json();
}
