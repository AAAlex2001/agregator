import { sendForm } from "@/source/shared/api/request";
import type { VatKind } from "../model/types";

export interface RespondPayload {
  comment: string;
  proposed_sum_amount: number;
  proposed_start_date: string;
  proposed_deadline: string;
  vat_kind: VatKind;
  expert_inn: string;
  expert_company_data: object;
  files: File[];
}

export async function respondToOrder(orderId: number, payload: RespondPayload): Promise<void> {
  await sendForm(
    `/orders/${orderId}/responses`,
    "POST",
    payload.files,
    (files) => {
      const form = new FormData();
      form.append("comment", payload.comment);
      form.append("proposed_sum_amount", String(payload.proposed_sum_amount));
      if (payload.proposed_start_date) form.append("proposed_start_date", payload.proposed_start_date);
      form.append("proposed_deadline", payload.proposed_deadline);
      form.append("vat_kind", payload.vat_kind);
      form.append("expert_inn", payload.expert_inn);
      form.append("expert_company_data", JSON.stringify(payload.expert_company_data));
      files.forEach((file) => form.append("files", file));
      return form;
    },
    "Не удалось отправить отклик",
  );
}
