import { uploadForm } from "@/shared/api/upload-form";
import type { BlitzInvoice, BlitzProofKind } from "../model/types";

/** Заказчик сообщает об оплате счёта и прикладывает платёжку или гарантийное письмо. */
export async function reportBlitzInvoicePaid(
  orderId: number,
  invoiceId: number,
  proofKind: BlitzProofKind,
  proof: File | null,
): Promise<BlitzInvoice> {
  /** Собирает форму заново при повторной отправке перечитанного файла. */
  function createBody(files: File[]): FormData {
    const body = new FormData();

    body.append("proof_kind", proofKind);
    files.forEach((file) => body.append("proof", file));

    return body;
  }

  const response = await uploadForm(`/blitz/orders/${orderId}/invoices/${invoiceId}/paid`, {
    method: "POST",
    files: proof ? [proof] : [],
    createBody,
    errorMessage: "Не удалось отправить подтверждение оплаты",
  });

  return response.json();
}
