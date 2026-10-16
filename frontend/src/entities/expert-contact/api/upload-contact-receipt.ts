import { request } from "@/shared/api/request";
import type { ContactDeal } from "../model/types";

/** Прикладывает чек к сделке для проверки оплаты исполнителем. */
export async function uploadContactReceipt(
  dealId: number,
  file: File,
): Promise<ContactDeal> {
  const form = new FormData();
  form.append("file", file);

  const response = await request(`/contact-deals/${dealId}/receipt`, {
    method: "POST",
    body: form,
    errorMessage: "Не удалось загрузить чек",
  });

  return response.json();
}
