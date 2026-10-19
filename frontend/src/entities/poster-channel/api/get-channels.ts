import { request } from "@/shared/api/request";
import type { PosterChannel } from "../model/types";

/** Свои каналы и группы по порядку подключения. */
export async function getChannels(): Promise<PosterChannel[]> {
  const response = await request("/poster/channels", {
    errorMessage: "Не удалось загрузить каналы",
  });

  return response.json();
}
