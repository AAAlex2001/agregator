import { request } from "@/shared/api/request";

/** Ответ API с чатом отклика. */
interface LaborContactResponse {
  chat_uuid: string;
}

/** Откликается на объявление и возвращает UUID чата с его автором. */
export async function contactLaborListing(listingId: number): Promise<string> {
  const response = await request(`/labor/listings/${listingId}/contact`, {
    method: "POST",
    errorMessage: "Не удалось открыть чат",
  });
  const data: LaborContactResponse = await response.json();

  return data.chat_uuid;
}
