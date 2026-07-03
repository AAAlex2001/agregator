import { apiJson } from "@/shared/services/api";
import type { VatKind } from "@/entites/response";

export interface Party {
  value: string;
  unrestricted_value: string;
  data: { inn?: string | null };
}

export interface RespondData {
  proposed_sum_amount: number;
  proposed_start_date: string;
  proposed_deadline: string;
  vat_kind: VatKind;
  comment: string;
  expert_inn?: string;
  expert_company_data?: string;
  files?: File[];
}

export async function createOrderResponse(orderId: number, data: RespondData): Promise<void> {
  const form = new FormData();
  form.append("proposed_sum_amount", String(data.proposed_sum_amount));
  form.append("proposed_start_date", data.proposed_start_date);
  form.append("proposed_deadline", data.proposed_deadline);
  form.append("vat_kind", data.vat_kind);
  form.append("comment", data.comment);
  if (data.expert_inn) form.append("expert_inn", data.expert_inn);
  if (data.expert_company_data) form.append("expert_company_data", data.expert_company_data);
  for (const file of data.files ?? []) form.append("files", file);
  await apiJson(`/orders/${orderId}/responses`, { method: "POST", body: form });
}

export async function suggestParties(query: string): Promise<Party[]> {
  return apiJson<Party[]>("/register/party-suggestions", {
    method: "POST",
    body: JSON.stringify({ query, count: 8 }),
  });
}
