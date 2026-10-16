import { uploadForm } from "@/shared/api/upload-form";
import type { UpdateResponseRequest } from "../model/types";

/** Сохраняет новые условия предложения, оставленные и добавленные файлы. */
export async function updateResponse(
  responseId: number,
  offer: UpdateResponseRequest,
): Promise<void> {
  /** Собирает multipart-поля API заново при повторной отправке файлов. */
  function createBody(files: File[]): FormData {
    const body = new FormData();
    body.append("comment", offer.comment);
    body.append("proposed_sum_amount", String(offer.proposed_sum_amount));

    if (offer.proposed_start_date) {
      body.append("proposed_start_date", offer.proposed_start_date);
    }

    body.append("proposed_deadline", offer.proposed_deadline);
    body.append("vat_kind", offer.vat_kind);
    body.append("keep_files", JSON.stringify(offer.keep_files));

    for (const file of files) {
      body.append("files", file);
    }

    return body;
  }

  await uploadForm(`/responses/${responseId}`, {
    method: "PUT",
    files: offer.files,
    createBody,
    errorMessage: "Не удалось обновить отклик",
  });
}
