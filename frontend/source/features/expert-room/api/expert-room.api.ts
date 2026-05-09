import { fetchWithSession } from "@/source/shared/api/session";
import { API_URL } from "@/source/shared/api/config";
import type {
  ExpertRoomHistoryResponse,
  ExpertRoomMessageData,
} from "@/source/entities/expert-room";

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

export async function fetchExpertRoomHistory(
  beforeId: number | null = null,
  limit = 50,
): Promise<ExpertRoomHistoryResponse> {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  if (beforeId !== null) {
    params.set("before_id", String(beforeId));
  }

  const response = await fetchWithSession(`${API_URL}/expert-room/messages?${params.toString()}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    return readError(response, "Не удалось загрузить чат");
  }

  return (await response.json()) as ExpertRoomHistoryResponse;
}

export async function sendExpertRoomMessage(text: string): Promise<ExpertRoomMessageData> {
  const response = await fetchWithSession(`${API_URL}/expert-room/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    return readError(response, "Не удалось отправить сообщение");
  }

  return (await response.json()) as ExpertRoomMessageData;
}

export function buildExpertRoomWebSocketUrl(): string {
  const explicitWsBase = process.env.NEXT_PUBLIC_WS_URL;

  if (explicitWsBase) {
    return `${explicitWsBase.replace(/\/$/, "")}/ws/expert-room`;
  }

  if (/^https?:\/\//i.test(API_URL)) {
    const wsBase = API_URL.replace(/\/$/, "")
      .replace(/^http:\/\//i, "ws://")
      .replace(/^https:\/\//i, "wss://");

    return `${wsBase}/ws/expert-room`;
  }

  if (typeof window === "undefined") {
    return "";
  }

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/api/ws/expert-room`;
}
