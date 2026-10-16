import { request } from "@/shared/api/request";
import type { ContactDeal } from "../model/types";

/** Подтверждает оплату и открывает покупателю контакты исполнителя. */
export async function confirmContactPayment(dealId: number): Promise<ContactDeal> {
  const response = await request(`/contact-deals/${dealId}/confirm-payment`, {
    method: "POST",
    errorMessage: "Не удалось подтвердить оплату",
  });

  return response.json();
}
