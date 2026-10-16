import { request } from "@/shared/api/request";
import type { ContactDeal } from "../model/types";

/** Загружает договор, подписи, чеки и доступные действия выбранной сделки. */
export async function getContactDeal(dealId: number): Promise<ContactDeal> {
  const response = await request(`/contact-deals/${dealId}`, {
    errorMessage: "Не удалось загрузить сделку",
  });

  return response.json();
}
