import { request } from "@/shared/api/request";
import type { ContactDeal } from "../model/types";

/** Отклоняет чек с объяснением причины для покупателя. */
export async function rejectContactPayment(
  dealId: number,
  reason: string,
): Promise<ContactDeal> {
  const response = await request(`/contact-deals/${dealId}/reject-payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reason }),
    errorMessage: "Не удалось отклонить чек",
  });

  return response.json();
}
