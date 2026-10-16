import { request } from "@/shared/api/request";
import type { DesignProfile } from "../model/types";

/** Загружает анкету проектировщика и его документы. */
export async function getDesignProfile(signal?: AbortSignal): Promise<DesignProfile> {
  const response = await request("/directions/design/expert-profile", {
    signal,
    errorMessage: "Не удалось загрузить анкету проектировщика.",
  });

  return response.json();
}
