import { request } from "@/shared/api/request";
import type { ExpertContactOffer } from "../model/types";

/** Загружает условия доступа к контактам текущего исполнителя. */
export async function getContactOffer(): Promise<ExpertContactOffer> {
  const response = await request("/expert-contacts/offer", {
    errorMessage: "Не удалось загрузить настройки контактов",
  });

  return response.json();
}
