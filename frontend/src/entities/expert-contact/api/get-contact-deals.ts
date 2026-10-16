import { request } from "@/shared/api/request";
import type { ContactDealListItem } from "../model/types";

/** Загружает сделки, в которых текущий пользователь покупает или продаёт контакты. */
export async function getContactDeals(): Promise<ContactDealListItem[]> {
  const response = await request("/contact-deals", {
    errorMessage: "Не удалось загрузить сделки",
  });
  const data: { items: ContactDealListItem[] } = await response.json();

  return data.items;
}
