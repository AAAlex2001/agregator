import { uploadForm } from "@/shared/api/upload-form";
import type { RespondRequest } from "../model/types";

/** Создаёт отклик с предложенными условиями и файлами исполнителя. */
export async function respondToOrder(
  orderId: number,
  offer: RespondRequest,
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
    body.append("expert_inn", offer.expert_inn);
    body.append(
      "expert_company_data",
      JSON.stringify(offer.expert_company_data ?? {}),
    );

    for (const file of files) {
      body.append("files", file);
    }

    return body;
  }

  await uploadForm(`/orders/${orderId}/responses`, {
    method: "POST",
    files: offer.files,
    createBody,
    errorMessage: "Не удалось отправить отклик",
  });
}
