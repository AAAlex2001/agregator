import { API_URL } from "@/source/shared/api/config";
import { fetchWithSession } from "@/source/shared/api/session";
import type { TechExpertDocumentCard, TechExpertDocumentsResult, TechExpertTip } from "../model/types";

function buildErrorMessage(response: Response, fallback: string): Promise<string> {
  return response
    .json()
    .then((body) => (typeof body?.detail === "string" ? body.detail : fallback))
    .catch(() => fallback);
}

export async function fetchTechExpertAutocomplete(query: string): Promise<TechExpertTip[]> {
  const response = await fetchWithSession(`${API_URL}/tech-expert/autocomplete?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error(await buildErrorMessage(response, "Не удалось загрузить подсказки"));
  }
  return response.json();
}

export async function fetchTechExpertDocuments(query: string): Promise<TechExpertDocumentsResult> {
  const response = await fetchWithSession(`${API_URL}/tech-expert/documents?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error(await buildErrorMessage(response, "Не удалось найти документы"));
  }
  return response.json();
}

export async function fetchTechExpertDocument(id: number): Promise<TechExpertDocumentCard> {
  const response = await fetchWithSession(`${API_URL}/tech-expert/document/${id}`);
  if (!response.ok) {
    throw new Error(await buildErrorMessage(response, "Не удалось загрузить документ"));
  }
  return response.json();
}

export async function fetchTechExpertDocumentContent(
  id: number,
  block: number,
  strict: boolean,
): Promise<string> {
  const response = await fetchWithSession(
    `${API_URL}/tech-expert/document/${id}/content?block=${block}&strict=${strict}`,
  );
  if (!response.ok) {
    throw new Error(await buildErrorMessage(response, "Не удалось загрузить содержимое"));
  }
  const data = await response.json();
  return typeof data?.content === "string" ? data.content : "";
}
