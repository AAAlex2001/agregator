import { request } from "@/shared/api/request";
import type { ExpertContactOffer, UpdateContactOffer } from "../model/types";

/** Сохраняет включение доступа, стоимость, реквизиты и подтверждённое согласие. */
export async function updateContactOffer(fields: UpdateContactOffer): Promise<ExpertContactOffer> {
  const response = await request("/expert-contacts/offer", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fields),
    errorMessage: "Не удалось сохранить настройки контактов",
  });

  return response.json();
}
