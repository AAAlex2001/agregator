import { request } from "@/shared/api/request";

/** Отмечает все входящие сообщения переписки прочитанными. */
export async function markChatMessagesRead(chatUuid: string): Promise<void> {
  await request(`/chats/${chatUuid}/read`, {
    method: "POST",
    errorMessage: "Не удалось отметить сообщения как прочитанные",
  });
}
