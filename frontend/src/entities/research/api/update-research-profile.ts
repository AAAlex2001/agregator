import { request } from "@/shared/api/request";
import type { ResearchProfile, ResearchProfileValues } from "../model/types";

/** Сохраняет научную квалификацию и направление исследований. */
export async function updateResearchProfile(
  fields: ResearchProfileValues,
): Promise<ResearchProfile> {
  const response = await request("/directions/research/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fields),
    errorMessage: "Не удалось сохранить анкету НИР",
  });

  return response.json();
}
