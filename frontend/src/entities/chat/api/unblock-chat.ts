import { request } from "@/shared/api/request";
import type { ChatDetailData } from "../model/types";

/** Снимает блокировку переписки и возвращает её новое состояние. */
export async function unblockChat(chatUuid: string): Promise<ChatDetailData> {
  const response = await request(`/chats/${chatUuid}/unblock`, {
    method: "POST",
    errorMessage: "Не удалось разблокировать чат",
  });

  return response.json();
}
