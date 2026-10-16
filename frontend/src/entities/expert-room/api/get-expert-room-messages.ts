import { request } from "@/shared/api/request";
import type { ExpertRoomHistory } from "../model/types";

/** Загружает 50 последних сообщений или 50 сообщений старше указанного. */
export async function getExpertRoomMessages(beforeId: number | null): Promise<ExpertRoomHistory> {
  const params = new URLSearchParams({ limit: "50" });

  if (beforeId !== null) {
    params.set("before_id", String(beforeId));
  }

  const response = await request(`/expert-room/messages?${params}`, {
    errorMessage: "Не удалось загрузить чат",
  });

  return response.json();
}
