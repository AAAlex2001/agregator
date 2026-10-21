import { uploadForm } from "@/shared/api/upload-form";
import type { BlitzChecklistFile } from "../model/audit-types";
import type { BlitzOrder } from "../model/types";

/** Документы по перечню: номер пункта для каждого файла. */
export async function uploadBlitzChecklist(
  orderId: number,
  checklist: BlitzChecklistFile[],
): Promise<BlitzOrder> {
  /** Собирает форму заново при повторной отправке перечитанных файлов. */
  function createBody(files: File[]): FormData {
    const body = new FormData();

    files.forEach((file) => body.append("files", file));
    checklist.forEach((entry) => body.append("items", String(entry.item)));

    return body;
  }

  const response = await uploadForm(`/blitz/orders/${orderId}/checklist`, {
    method: "POST",
    files: checklist.map((entry) => entry.file),
    createBody,
    errorMessage: "Не удалось загрузить документы",
  });

  return response.json();
}