import { request } from "@/shared/api/request";
import type { TechExpertDocumentCard } from "../model/types";

/** Загружает карточку документа с реквизитами и числом блоков текста. */
export async function getTechExpertDocument(documentId: number): Promise<TechExpertDocumentCard> {
  const response = await request(`/tech-expert/document/${documentId}`, {
    errorMessage: "Не удалось загрузить документ",
  });

  return response.json();
}
