import { apiJson } from "@/shared/services/api";
import type { ChatDetail, ChatList, ChatMessage } from "./types";

export function listChats(): Promise<ChatList> {
  return apiJson<ChatList>("/chats/");
}

export function getChat(uuid: string, limit = 200): Promise<ChatDetail> {
  return apiJson<ChatDetail>(`/chats/${uuid}?limit=${limit}`);
}

export function sendChatMessage(uuid: string, text: string, files: File[]): Promise<ChatMessage> {
  const form = new FormData();
  form.append("text", text);
  for (const file of files) form.append("files", file);
  return apiJson<ChatMessage>(`/chats/${uuid}/messages`, { method: "POST", body: form });
}

export function openChatByOrder(orderId: number): Promise<ChatDetail> {
  return apiJson<ChatDetail>("/chats/open", {
    method: "POST",
    body: JSON.stringify({ order_id: orderId }),
  });
}

export function markChatRead(uuid: string): Promise<unknown> {
  return apiJson(`/chats/${uuid}/read`, { method: "POST" });
}

export function chatSocketUrl(uuid: string): string {
  const scheme = window.location.protocol === "https:" ? "wss" : "ws";
  return `${scheme}://${window.location.host}/api/ws/chats/${uuid}`;
}

