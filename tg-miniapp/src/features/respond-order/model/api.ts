import { apiJson } from "@/shared/services/api";

export type VatKind = "NONE" | "VAT_5" | "VAT_7" | "VAT_22";

export interface RespondData {
  proposed_sum_amount: number;
  proposed_start_date: string;
  proposed_deadline: string;
  vat_kind: VatKind;
  comment: string;
}

export async function createOrderResponse(orderId: number, data: RespondData): Promise<void> {
  const form = new FormData();
  form.append("proposed_sum_amount", String(data.proposed_sum_amount));
  form.append("proposed_start_date", data.proposed_start_date);
  form.append("proposed_deadline", data.proposed_deadline);
  form.append("vat_kind", data.vat_kind);
  form.append("comment", data.comment);
  await apiJson(`/orders/${orderId}/responses`, { method: "POST", body: form });
}
