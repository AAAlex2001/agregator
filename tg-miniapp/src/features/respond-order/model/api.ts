import { apiJson } from "@/shared/services/api";

export interface RespondData {
  proposed_sum_amount: number;
  proposed_deadline: string;
  comment: string;
}

export async function createOrderResponse(orderId: number, data: RespondData): Promise<void> {
  const form = new FormData();
  form.append("proposed_sum_amount", String(data.proposed_sum_amount));
  form.append("proposed_deadline", data.proposed_deadline);
  form.append("comment", data.comment);
  await apiJson(`/orders/${orderId}/responses`, { method: "POST", body: form });
}
