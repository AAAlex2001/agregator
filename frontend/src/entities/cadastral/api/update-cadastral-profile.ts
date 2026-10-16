import { request } from "@/shared/api/request";
import type { CadastralProfile, CadastralProfileValues } from "../model/types";

/** Сохраняет образование, реестровые данные и место работы инженера. */
export async function updateCadastralProfile(
  fields: CadastralProfileValues,
): Promise<CadastralProfile> {
  const response = await request("/directions/cadastral/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fields),
    errorMessage: "Не удалось сохранить анкету кадастрового инженера",
  });

  return response.json();
}
