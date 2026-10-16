import { request } from "@/shared/api/request";
import type { EcologyProfile } from "../model/types";

/** Загружает анкету эколога вместе с документами о квалификации. */
export async function getEcologyProfile(): Promise<EcologyProfile> {
  const response = await request("/directions/ecology/expert-profile", {
    errorMessage: "Не удалось загрузить анкету эколога",
  });

  return response.json();
}
