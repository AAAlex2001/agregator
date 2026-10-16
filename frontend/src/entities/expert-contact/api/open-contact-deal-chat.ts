import { request } from "@/shared/api/request";

/** Открывает переписку покупателя и исполнителя по сделке и возвращает её uuid. */
export async function openContactDealChat(dealId: number): Promise<string> {
  const response = await request(`/chats/deal/${dealId}/open`, {
    method: "POST",
    errorMessage: "Не удалось открыть чат по сделке",
  });
  const chat: { uuid: string } = await response.json();

  return chat.uuid;
}
