import { request } from "@/shared/api/request";
import type { TelegramPreview } from "../model/types";

/** Текст поста так, как его покажет Telegram, и длина в его лимите. */
export async function getTelegramPreview(html: string, mediaCount: number): Promise<TelegramPreview> {
  const response = await request("/poster/telegram-preview", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      html,
      media_count: mediaCount,
    }),
    errorMessage: "Не удалось подготовить предпросмотр",
  });

  return response.json();
}
