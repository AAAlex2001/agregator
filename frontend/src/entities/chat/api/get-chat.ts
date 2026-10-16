import { request } from "@/shared/api/request";
import type { ChatDetailData } from "../model/types";

/** Загружает переписку; сервер заодно отмечает входящие сообщения прочитанными. */
export async function getChat(chatUuid: string): Promise<ChatDetailData> {
  const response = await request(`/chats/${chatUuid}`, {
    errorMessage: "Не удалось загрузить чат",
  });

  return response.json();
}
