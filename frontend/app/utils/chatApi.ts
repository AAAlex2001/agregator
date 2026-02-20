import { fetchWithSessionRefresh } from "@/app/utils/sessionAuth";

export interface ChatListItem {
  id: number;
  order_id: number;
  counterpart_id: number;
  counterpart_name: string;
  counterpart_avatar_url: string | null;
  last_message_text: string;
  last_message_sender_id: number | null;
  last_message_at: string | null;
  unread_count: number;
  updated_at: string;
}

export interface ChatListResponse {
  items: ChatListItem[];
  total: number;
}

export interface ChatMessage {
  id: number;
  chat_id: number;
  sender_id: number;
  sender_role: "CUSTOMER" | "EXPERT";
  text: string;
  created_at: string;
}

export interface ChatDetailResponse {
  id: number;
  order_id: number;
  customer_id: number;
  expert_id: number;
  order_title: string;
  order_company: string;
  order_date: string;
  order_sum: string;
  order_badges: { text: string; variant: string }[];
  counterpart_id: number;
  counterpart_name: string;
  counterpart_avatar_url: string | null;
  messages: ChatMessage[];
}


function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || "/api";
}

async function readError(response: Response, fallback: string): Promise<never> {
  let message = fallback;
  try {
    const body = (await response.json()) as { detail?: string };
    if (body?.detail) {
      message = body.detail;
    }
  } catch {
  }
  throw new Error(message);
}

export async function fetchChats(): Promise<ChatListResponse> {
  const response = await fetchWithSessionRefresh(`${getApiBaseUrl()}/chats/`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    return readError(response, "Не удалось загрузить чаты");
  }

  return (await response.json()) as ChatListResponse;
}

export async function fetchChatDetail(chatId: number): Promise<ChatDetailResponse> {
  const response = await fetchWithSessionRefresh(`${getApiBaseUrl()}/chats/${chatId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    return readError(response, "Не удалось загрузить чат");
  }

  return (await response.json()) as ChatDetailResponse;
}

export async function openChatByOrder(orderId: number): Promise<ChatDetailResponse> {
  const response = await fetchWithSessionRefresh(`${getApiBaseUrl()}/chats/open`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ order_id: orderId }),
  });

  if (!response.ok) {
    return readError(response, "Не удалось открыть чат");
  }

  return (await response.json()) as ChatDetailResponse;
}

export async function sendChatMessage(chatId: number, text: string): Promise<ChatMessage> {
  const response = await fetchWithSessionRefresh(`${getApiBaseUrl()}/chats/${chatId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    return readError(response, "Не удалось отправить сообщение");
  }

  return (await response.json()) as ChatMessage;
}

export function buildChatWebSocketUrl(chatId: number): string {
  const explicitWsBase = process.env.NEXT_PUBLIC_WS_URL;

  if (explicitWsBase) {
    return `${explicitWsBase.replace(/\/$/, "")}/ws/chats/${chatId}`;
  }

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/api/ws/chats/${chatId}`;
}
