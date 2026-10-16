import { request } from "@/shared/api/request";
import type { CompanySuggestion } from "../model/types";

/** Ищет компании по ИНН или названию через серверные подсказки ДаДата. */
export async function getCompanySuggestions(query: string): Promise<CompanySuggestion[]> {
  const response = await request("/register/party-suggestions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, count: 10 }),
    errorMessage: "Не удалось найти компанию",
  });

  return response.json();
}
