import { adminFetch, fileBody, jsonBody } from "@/shared/api";
import type { Clarification, ClarificationList, ClarificationPayload, Taxonomy } from "../model/types";

/** Список разъяснений, при необходимости — только одного статуса публикации. */
export const fetchClarifications = async (publicationStatus: string): Promise<ClarificationList> => {
  const params = new URLSearchParams();

  if (publicationStatus) params.set("publication_status", publicationStatus);

  const response = await adminFetch(`/rtn/clarifications?${params}`);

  return response.json();
};

/** Разъяснение для редактирования. */
export const fetchClarification = async (id: number): Promise<Clarification> => {
  const response = await adminFetch(`/rtn/clarifications/${id}`);

  return response.json();
};

/** Создать разъяснение. С answered_question_id вопрос посетителя помечается обработанным. */
export const createClarification = async (payload: ClarificationPayload): Promise<Clarification> => {
  const response = await adminFetch("/rtn/clarifications", jsonBody("POST", payload));

  return response.json();
};

/** Сохранить разъяснение. */
export const updateClarification = async (id: number, payload: ClarificationPayload): Promise<Clarification> => {
  const response = await adminFetch(`/rtn/clarifications/${id}`, jsonBody("PUT", payload));

  return response.json();
};

/** Удалить разъяснение. */
export const deleteClarification = async (id: number): Promise<void> => {
  await adminFetch(`/rtn/clarifications/${id}`, { method: "DELETE" });
};

/** Загрузить PDF запроса или ответа. Возвращает адрес файла. */
export const uploadClarificationPdf = async (file: File): Promise<string> => {
  const response = await adminFetch("/rtn/upload-pdf", fileBody(file));
  const upload: { url: string } = await response.json();

  return upload.url;
};

/** Справочники классификатора «Ростехнадзор отвечает». */
export const fetchTaxonomy = async (): Promise<Taxonomy> => {
  const response = await adminFetch("/rtn/taxonomy");

  return response.json();
};
