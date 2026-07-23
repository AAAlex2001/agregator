import { fetchWithSession } from "@/source/shared/api/session";
import { API_URL } from "@/source/shared/api/config";
import { readErrorMessage } from "@/source/shared/api/errorMessage";
import { buildWebSocketUrl } from "@/source/shared/api/wsUrl";
import { uploadWithProgress } from "@/source/shared/api/uploadWithProgress";
import type { ChatDetailData, ChatListItemData, ChatMessageData } from "../model/types";

interface ChatListResponse {
  items: ChatListItemData[];
  total: number;
}

export async function fetchChatList(): Promise<ChatListItemData[]> {
  const response = await fetchWithSession(`${API_URL}/chats/`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Не удалось загрузить чаты"));
  }

  const data = (await response.json()) as ChatListResponse;
  return data.items;
}

export async function fetchChatDetail(chatUuid: string): Promise<ChatDetailData> {
  const response = await fetchWithSession(`${API_URL}/chats/${chatUuid}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Не удалось загрузить чат"));
  }

  return (await response.json()) as ChatDetailData;
}

export async function openChatByOrder(orderId: number, expertId?: number): Promise<ChatDetailData> {
  const response = await fetchWithSession(`${API_URL}/chats/open`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order_id: orderId, expert_id: expertId ?? null }),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Не удалось открыть чат"));
  }

  return (await response.json()) as ChatDetailData;
}

export async function blockChat(chatUuid: string): Promise<ChatDetailData> {
  const response = await fetchWithSession(`${API_URL}/chats/${chatUuid}/block`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Не удалось заблокировать чат"));
  }

  return (await response.json()) as ChatDetailData;
}

export async function unblockChat(chatUuid: string): Promise<ChatDetailData> {
  const response = await fetchWithSession(`${API_URL}/chats/${chatUuid}/unblock`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Не удалось разблокировать чат"));
  }

  return (await response.json()) as ChatDetailData;
}

export async function sendChatMessage(
  chatUuid: string,
  text: string,
  files: File[] = [],
  clientMessageId: string,
  onProgress?: (percent: number) => void,
): Promise<ChatMessageData> {
  const formData = new FormData();
  formData.append("text", text);
  formData.append("client_message_id", clientMessageId);
  for (const file of files) {
    formData.append("files", file);
  }

  const url = `${API_URL}/chats/${chatUuid}/messages`;

  if (files.length > 0 && onProgress) {
    const result = await uploadWithProgress<ChatMessageData>(url, formData, {
      onProgress: (loaded, total) => onProgress(Math.round((loaded / total) * 100)),
    });

    if (!result.ok || !result.body) {
      throw new Error(result.errorMessage ?? "Не удалось отправить сообщение");
    }

    return result.body;
  }

  const response = await fetchWithSession(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Не удалось отправить сообщение"));
  }

  return (await response.json()) as ChatMessageData;
}

export async function markChatMessagesRead(chatUuid: string): Promise<void> {
  const response = await fetchWithSession(`${API_URL}/chats/${chatUuid}/read`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Не удалось отметить сообщения как прочитанные"));
  }
}

export function buildChatWebSocketUrl(chatUuid: string): string {
  return buildWebSocketUrl(`/ws/chats/${chatUuid}`);
}

export function createChatWebSocket(chatUuid: string): WebSocket {
  return new WebSocket(buildChatWebSocketUrl(chatUuid));
}
