import { request } from "@/shared/api/request";

/** Удаляет заявку покупателя на получение контактов. */
export async function deleteContactDeal(dealId: number): Promise<void> {
  await request(`/contact-deals/${dealId}`, {
    method: "DELETE",
    errorMessage: "Не удалось удалить заявку на контакты",
  });
}
