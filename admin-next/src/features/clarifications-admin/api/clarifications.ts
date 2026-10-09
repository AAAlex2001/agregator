import type { Question } from "@/entities/question";
import { adminRequest, fileBody, jsonBody } from "@/shared/api";
import type { Clarification, ClarificationList, ClarificationPayload } from "../model/types";

type Upload = {
  url: string;
};

/** Список разъяснений, при необходимости — только одного статуса публикации. */
export const fetchClarifications = (publicationStatus: string) => {
  const params = new URLSearchParams();

  if (publicationStatus) params.set("publication_status", publicationStatus);

  return adminRequest<ClarificationList>(`/rtn/clarifications?${params}`);
};

/** Разъяснение для редактирования. */
export const fetchClarification = (id: number) => adminRequest<Clarification>(`/rtn/clarifications/${id}`);

/** Создать разъяснение. С answered_question_id вопрос посетителя помечается обработанным. */
export const createClarification = (payload: ClarificationPayload) =>
  adminRequest<Clarification>("/rtn/clarifications", jsonBody("POST", payload));

/** Сохранить разъяснение. */
export const updateClarification = (id: number, payload: ClarificationPayload) =>
  adminRequest<Clarification>(`/rtn/clarifications/${id}`, jsonBody("PUT", payload));

/** Удалить разъяснение. */
export const deleteClarification = (id: number) =>
  adminRequest<void>(`/rtn/clarifications/${id}`, { method: "DELETE" });

/** Загрузить PDF запроса или ответа. Возвращает адрес файла. */
export const uploadPdf = async (file: File) => (await adminRequest<Upload>("/rtn/upload-pdf", fileBody(file))).url;

/** Вопрос посетителя — чтобы подставить его текст в новое разъяснение. */
export const fetchQuestion = (id: number) => adminRequest<Question>(`/rtn/questions/${id}`);
