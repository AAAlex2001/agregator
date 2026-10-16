import { request } from "@/shared/api/request";
import type { ChatDetailData } from "../model/types";

/** Блокирует переписку со стороны заказчика и возвращает её новое состояние. */
export async function blockChat(chatUuid: string): Promise<ChatDetailData> {
  const response = await request(`/chats/${chatUuid}/block`, {
    method: "POST",
    errorMessage: "Не удалось заблокировать чат",
  });

  return response.json();
}
