import { request } from "@/shared/api/request";
import type { TechExpertDocumentContent } from "../model/types";

/** Загружает блок текста документа; со второго блока сервер отдаёт текст без шапки. */
export async function getTechExpertDocumentContent(
  documentId: number,
  block: number,
): Promise<string> {
  const params = new URLSearchParams({
    block: String(block),
    strict: String(block > 1),
  });
  const response = await request(`/tech-expert/document/${documentId}/content?${params}`, {
    errorMessage: "Не удалось загрузить содержимое",
  });
  const data: TechExpertDocumentContent = await response.json();

  return data.content;
}
