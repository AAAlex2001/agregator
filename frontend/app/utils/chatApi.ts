import { fetchWithSessionRefresh } from "@/app/utils/sessionAuth";

export interface ChatListItem {
  id: number;
  uuid: string;
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
  file_url: string | null;
  file_name: string | null;
  is_read: boolean;
  created_at: string;
}

export interface ChatDetailResponse {
  id: number;
  uuid: string;
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

export async function fetchChatDetail(chatUuid: string): Promise<ChatDetailResponse> {
  const response = await fetchWithSessionRefresh(`${getApiBaseUrl()}/chats/${chatUuid}`, {
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

export async function sendChatMessage(
  chatUuid: string,
  text: string,
  file?: File | null,
  onProgress?: (pct: number) => void,
): Promise<ChatMessage> {
  const formData = new FormData();
  formData.append("text", text);
  if (file) {
    formData.append("file", file);
  }

  const url = `${getApiBaseUrl()}/chats/${chatUuid}/messages`;

  if (file && onProgress) {
    return new Promise<ChatMessage>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url);
      xhr.withCredentials = true;

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText) as ChatMessage);
        } else {
          let message = "Не удалось отправить сообщение";
          try {
            const body = JSON.parse(xhr.responseText) as { detail?: string };
            if (body?.detail) message = body.detail;
          } catch { /* ignore */ }
          reject(new Error(message));
        }
      };

      xhr.onerror = () => reject(new Error("Ошибка сети"));
      xhr.send(formData);
    });
  }

  const response = await fetchWithSessionRefresh(url, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    return readError(response, "Не удалось отправить сообщение");
  }

  return (await response.json()) as ChatMessage;
}

export async function markChatMessagesRead(chatUuid: string): Promise<void> {
  const response = await fetchWithSessionRefresh(`${getApiBaseUrl()}/chats/${chatUuid}/read`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    return readError(response, "Не удалось отметить сообщения как прочитанные");
  }
}

export function buildChatWebSocketUrl(chatUuid: string): string {
  const explicitWsBase = process.env.NEXT_PUBLIC_WS_URL;

  if (explicitWsBase) {
    return `${explicitWsBase.replace(/\/$/, "")}/ws/chats/${chatUuid}`;
  }

  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  if (apiBase && /^https?:\/\//i.test(apiBase)) {
    const normalizedApi = apiBase.replace(/\/$/, "");
    const wsBase = normalizedApi
      .replace(/^http:\/\//i, "ws://")
      .replace(/^https:\/\//i, "wss://");
    return `${wsBase}/ws/chats/${chatUuid}`;
  }

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/api/ws/chats/${chatUuid}`;
}
