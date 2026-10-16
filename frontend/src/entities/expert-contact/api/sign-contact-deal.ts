import { request } from "@/shared/api/request";
import type { ContactDeal } from "../model/types";

/** Подписывает договор паролем аккаунта и подтверждает согласие с его условиями. */
export async function signContactDeal(
  dealId: number,
  password: string,
): Promise<ContactDeal> {
  const response = await request(`/contact-deals/${dealId}/sign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password,
      accepted: true,
    }),
    errorMessage: "Не удалось подписать договор",
  });

  return response.json();
}
