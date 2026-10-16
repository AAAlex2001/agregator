import { request } from "@/shared/api/request";
import type { ContactDeal } from "../model/types";

/** Создаёт договор на получение контактов выбранного исполнителя. */
export async function createContactDeal(sellerId: number): Promise<ContactDeal> {
  const response = await request("/contact-deals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ seller_id: sellerId }),
    errorMessage: "Не удалось создать договор",
  });

  return response.json();
}
