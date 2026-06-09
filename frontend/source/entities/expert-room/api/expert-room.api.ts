import { fetchWithSession } from "@/source/shared/api/session";
import { API_URL } from "@/source/shared/api/config";
import { readErrorMessage } from "@/source/shared/api/errorMessage";
import { buildWebSocketUrl } from "@/source/shared/api/wsUrl";
import { uploadWithProgress } from "@/source/shared/api/uploadWithProgress";
import type {
  ExpertRoomHistoryResponse,
  ExpertRoomMessageData,
} from "../model/types";

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
    throw new Error(await readErrorMessage(response, "Не удалось загрузить чат"));
  }

  return (await response.json()) as ExpertRoomHistoryResponse;
}

export async function sendExpertRoomMessage(
  text: string,
  files: File[] = [],
  onProgress?: (percent: number) => void,
): Promise<ExpertRoomMessageData> {
  const formData = new FormData();
  formData.append("text", text);
  for (const file of files) {
    formData.append("files", file);
  }

  const url = `${API_URL}/expert-room/messages`;

  if (files.length > 0 && onProgress) {
    const result = await uploadWithProgress<ExpertRoomMessageData>(url, formData, {
      onProgress: (loaded, total) => {
        onProgress(Math.round((loaded / total) * 100));
      },
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

  return (await response.json()) as ExpertRoomMessageData;
}

export function buildExpertRoomWebSocketUrl(): string {
  return buildWebSocketUrl("/ws/expert-room");
}
