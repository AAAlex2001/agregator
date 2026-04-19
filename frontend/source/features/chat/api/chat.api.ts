import { fetchWithSession } from "@/source/shared/api/session";
import { API_URL } from "@/source/shared/api/config";
import type { ChatDetailData, ChatListItemData, ChatMessageData } from "@/source/entities/chat";

interface ChatListResponse {
  items: ChatListItemData[];
  total: number;
}

async function readError(response: Response, fallback: string): Promise<never> {
  let message = fallback;

  try {
    const body = (await response.json()) as { detail?: string };
    if (body?.detail) {
      message = body.detail;
    }
  } catch {
    // Ignore malformed error payloads.
  }

  throw new Error(message);
}

export async function fetchChatList(): Promise<ChatListItemData[]> {
  const response = await fetchWithSession(`${API_URL}/chats/`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    return readError(response, "Не удалось загрузить чаты");
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
    return readError(response, "Не удалось загрузить чат");
  }

  return (await response.json()) as ChatDetailData;
}

export async function openChatByOrder(orderId: number): Promise<ChatDetailData> {
  const response = await fetchWithSession(`${API_URL}/chats/open`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order_id: orderId }),
  });

  if (!response.ok) {
    return readError(response, "Не удалось открыть чат");
  }

  return (await response.json()) as ChatDetailData;
}

export async function sendChatMessage(
  chatUuid: string,
  text: string,
  files: File[] = [],
  onProgress?: (percent: number) => void,
): Promise<ChatMessageData> {
  const formData = new FormData();
  formData.append("text", text);
  for (const file of files) {
    formData.append("files", file);
  }

  const url = `${API_URL}/chats/${chatUuid}/messages`;

  if (files.length > 0 && onProgress) {
    return new Promise<ChatMessageData>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url);
      xhr.withCredentials = true;

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText) as ChatMessageData);
          return;
        }

        let message = "Не удалось отправить сообщение";

        try {
          const body = JSON.parse(xhr.responseText) as { detail?: string };
          if (body?.detail) {
            message = body.detail;
          }
        } catch {
          // Ignore malformed error payloads.
        }

        reject(new Error(message));
      };

      xhr.onerror = () => reject(new Error("Ошибка сети"));
      xhr.send(formData);
    });
  }

  const response = await fetchWithSession(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    return readError(response, "Не удалось отправить сообщение");
  }

  return (await response.json()) as ChatMessageData;
}

export async function markChatMessagesRead(chatUuid: string): Promise<void> {
  const response = await fetchWithSession(`${API_URL}/chats/${chatUuid}/read`, {
    method: "POST",
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

  if (/^https?:\/\//i.test(API_URL)) {
    const wsBase = API_URL.replace(/\/$/, "")
      .replace(/^http:\/\//i, "ws://")
      .replace(/^https:\/\//i, "wss://");

    return `${wsBase}/ws/chats/${chatUuid}`;
  }

  if (typeof window === "undefined") {
    return "";
  }

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/api/ws/chats/${chatUuid}`;
}