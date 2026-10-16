import { request } from "@/shared/api/request";
import type { CadastralProfile } from "../model/types";

/** Загружает анкету кадастрового инженера и приложенные документы. */
export async function getCadastralProfile(): Promise<CadastralProfile> {
  const response = await request("/directions/cadastral/profile", {
    errorMessage: "Не удалось загрузить анкету кадастрового инженера",
  });

  return response.json();
}
