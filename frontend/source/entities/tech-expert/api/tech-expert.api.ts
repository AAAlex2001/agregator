import { API_URL } from "@/source/shared/api/config";
import { fetchWithSession } from "@/source/shared/api/session";
import { readErrorMessage } from "@/source/shared/api/errorMessage";
import type { TechExpertDocumentCard, TechExpertDocumentsResult, TechExpertTip } from "../model/types";

export async function fetchTechExpertAutocomplete(query: string): Promise<TechExpertTip[]> {
  const response = await fetchWithSession(`${API_URL}/tech-expert/autocomplete?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Не удалось загрузить подсказки"));
  }
  return response.json();
}

export async function fetchTechExpertDocuments(query: string): Promise<TechExpertDocumentsResult> {
  const response = await fetchWithSession(`${API_URL}/tech-expert/documents?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Не удалось найти документы"));
  }
  return response.json();
}

export async function fetchTechExpertDocument(id: number): Promise<TechExpertDocumentCard> {
  const response = await fetchWithSession(`${API_URL}/tech-expert/document/${id}`);
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Не удалось загрузить документ"));
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
    throw new Error(await readErrorMessage(response, "Не удалось загрузить содержимое"));
  }
  const data = await response.json();
  return typeof data?.content === "string" ? data.content : "";
}
