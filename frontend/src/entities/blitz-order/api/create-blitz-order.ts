import { uploadForm } from "@/shared/api/upload-form";
import type { BlitzOrder, BlitzOrderPayload } from "../model/types";

/** Новая заявка: данные, документация и карточка организации. */
export async function createBlitzOrder(
  payload: BlitzOrderPayload,
  files: File[],
  companyCard: File | null,
): Promise<BlitzOrder> {
  /** Собирает форму заново при повторной отправке перечитанных файлов. */
  function createBody(documents: File[]): FormData {
    const body = new FormData();

    body.append("payload", JSON.stringify(payload));
    documents.forEach((file) => body.append("files", file));

    if (companyCard) {
      body.append("company_card", companyCard);
    }

    return body;
  }

  const response = await uploadForm("/blitz/orders", {
    method: "POST",
    files,
    createBody,
    errorMessage: "Не удалось отправить заявку",
  });

  return response.json();
}
