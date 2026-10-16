import { request } from "@/shared/api/request";
import type { ChatListItemData } from "../model/types";

/** Ответ сервера со списком диалогов. */
interface ChatListResponse {
  items: ChatListItemData[];
}

/** Загружает все диалоги текущего пользователя. */
export async function getChatList(): Promise<ChatListItemData[]> {
  const response = await request("/chats/", {
    cache: "no-store",
    errorMessage: "Не удалось загрузить чаты",
  });
  const data: ChatListResponse = await response.json();

  return data.items;
}
