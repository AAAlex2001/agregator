import { request } from "@/shared/api/request";
import type { EcologyProfile, EcologyProfileValues } from "../model/types";

/** Сохраняет виды работ и практические навыки эколога. */
export async function updateEcologyProfile(
  fields: EcologyProfileValues,
): Promise<EcologyProfile> {
  const response = await request("/directions/ecology/expert-profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fields),
    errorMessage: "Не удалось сохранить анкету эколога",
  });

  return response.json();
}
