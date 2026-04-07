import type {
  ResponseTabKey,
  ResponseApiItem,
  ResponsesApiList,
} from "./types";
import { fetchWithSessionRefresh } from "@/shared/lib/sessionAuth";

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || "/api";
}

export async function fetchResponses(tab: ResponseTabKey, skip = 0, limit = 50): Promise<ResponsesApiList> {
  const apiBaseUrl = getApiBaseUrl();

  const query = new URLSearchParams({
    skip: String(skip),
    limit: String(limit),
  });

  query.set("tab", tab);

  const response = await fetchWithSessionRefresh(`${apiBaseUrl}/responses?${query.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    let message = "Не удалось загрузить отклики";
    try {
      const body = (await response.json()) as { detail?: string };
      if (body?.detail) {
        message = body.detail;
      }
    } catch {
    }
    throw new Error(message);
  }

  return (await response.json()) as ResponsesApiList;
}

export async function updateResponseStatus(
  responseId: number,
  newStatus: ResponseApiItem["status"]
): Promise<void> {
  const apiBaseUrl = getApiBaseUrl();

  const response = await fetchWithSessionRefresh(`${apiBaseUrl}/responses/${responseId}/status?new_status=${newStatus}`, {
    method: "PATCH",
    credentials: "include",
  });

  if (!response.ok) {
    let message = "Не удалось обновить статус отклика";
    try {
      const body = (await response.json()) as { detail?: string };
      if (body?.detail) {
        message = body.detail;
      }
    } catch {
    }
    throw new Error(message);
  }
}
