import { request } from "@/shared/api/request";
import type { PosterChannel } from "../model/types";

/** Перечитывает у Telegram название, участников и права бота. */
export async function refreshChannel(id: number): Promise<PosterChannel> {
  const response = await request(`/poster/channels/${id}/refresh`, {
    method: "POST",
    errorMessage: "Не удалось обновить канал",
  });

  return response.json();
}
